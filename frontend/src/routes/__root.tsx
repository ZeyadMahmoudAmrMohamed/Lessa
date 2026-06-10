import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import i18n, { applyLangSideEffects } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-[#0F766E]">404</h1>
        <h2 className="mt-4 text-xl font-bold text-[#1E3A5F]">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-slate-500">Page not found</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
        >
          العودة للرئيسية / Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold text-[#1E3A5F]">حدث خطأ</h1>
        <p className="mt-2 text-sm text-slate-500">Something went wrong.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
        >
          حاول مجددًا
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "لسّه؟ — تتبع طوابير الخدمات الحكومية" },
      {
        name: "description",
        content:
          "احجز دورك في الخدمات الحكومية وتابع الطابور لحظة بلحظة. Lessa? — book and track government queues in real time.",
      },
    ],
    links: [
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    // Apply persisted language on mount
    applyLangSideEffects(i18n.language);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <AIAssistantWidget />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}
