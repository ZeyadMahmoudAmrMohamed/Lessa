import { Navigate, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth, roleHome } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} />;
  }
  return <>{children}</>;
}
