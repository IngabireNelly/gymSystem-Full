// Thin wrapper around fetch for the Spring Boot backend.
// Set VITE_API_URL in a .env file to point somewhere else; defaults to the local backend on port 8081.
const BASE_URL: string =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ??
  "http://localhost:8081/api";

const TOKEN_KEY = "gym.auth.token";

function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

let token: string | null = readStoredToken();
let onUnauthorized: (() => void) | null = null;

export function getToken(): string | null {
  return token;
}

export function setToken(value: string): void {
  token = value;
  try {
    sessionStorage.setItem(TOKEN_KEY, value);
  } catch {
    // storage unavailable: token lives in memory for this page only
  }
}

export function clearToken(): void {
  token = null;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

/** Called when the server rejects a stored token (expired or invalid), so the app can sign the user out. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  return "Could not reach the server. Check that the backend is running.";
}

interface ErrorBody {
  message?: string;
  fieldErrors?: Record<string, string>;
}

function messageFrom(body: ErrorBody | null, status: number): string {
  if (body?.message) return body.message;
  if (body?.fieldErrors) return Object.values(body.fieldErrors).join(" ");
  return `Request failed (${status}).`;
}

export async function api<T>(
path: string,
options: {method?: string;body?: unknown;} = {})
: Promise<T> {
  const sentToken = token;
  const hasBody = options.body !== undefined;

  const headers: Record<string, string> = {};
  if (hasBody) headers["Content-Type"] = "application/json";
  if (sentToken) headers["Authorization"] = `Bearer ${sentToken}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined
  });

  // A rejected stored token means the session is over. Login failures are handled by the caller.
  if (res.status === 401 && sentToken && path !== "/auth/login") {
    clearToken();
    onUnauthorized?.();
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    throw new ApiError(messageFrom(data as ErrorBody | null, res.status), res.status);
  }
  return data as T;
}
