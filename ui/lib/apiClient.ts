import * as FileSystem from 'expo-file-system/legacy';

// Cloud Run (europe-west1). HTTPS is required on real devices — iOS App Transport
// Security blocks cleartext HTTP, so the old LAN address only ever worked in dev.
export const API_BASE = 'https://karmana-backend-894590249756.europe-west1.run.app/api';

// Local dev against a backend on your Mac: swap in your LAN IP (not localhost —
// Expo Go on a physical device can't reach the host's loopback).
// export const API_BASE = 'http://192.168.29.103:8080/api';

// Flip to true when testing UI without a running backend
export const MOCK_AUTH = false;

const TOKEN_PATH = `${(FileSystem as any).documentDirectory}auth-token.json`;

// ── token persistence ────────────────────────────────────────────────────────

export async function saveToken(token: string): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(TOKEN_PATH, JSON.stringify({ token }));
  } catch {}
}

export async function loadToken(): Promise<string | null> {
  try {
    const info = await FileSystem.getInfoAsync(TOKEN_PATH);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(TOKEN_PATH);
    return JSON.parse(raw).token ?? null;
  } catch {
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(TOKEN_PATH);
    if (info.exists) await FileSystem.deleteAsync(TOKEN_PATH);
  } catch {}
}

// ── http helpers ─────────────────────────────────────────────────────────────

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  if (MOCK_AUTH) {
    if (path === '/auth/login' || path === '/auth/register') {
      return { token: 'mock-token', name: 'Test User', email: 'test@example.com', onboardingComplete: true } as T;
    }
    if (path === '/users/me/profile') {
      return { age: '25' } as T;
    }
    return {} as T;
  }

  const { method = 'GET', body, token } = opts;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (json as any)?.message ||
      Object.values((json as any)?.errors ?? {}).join(', ') ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json as T;
}
