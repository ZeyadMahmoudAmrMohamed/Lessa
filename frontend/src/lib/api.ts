const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

function getToken(): string | null {
  return localStorage.getItem("lessa_token");
}

interface FetchOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", body, auth = true, query }: FetchOptions = {},
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const json = await res.json();
      message = json.message ?? json.error ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
