import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, clearToken, loadToken, saveToken } from '../lib/apiClient';

export type User = {
  name: string;
  email: string;
  /** True when the user has completed the onboarding wizard. */
  onboardingComplete: boolean;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  /** True until the persisted session has been loaded. */
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<AuthResponse>;
  logOut: () => Promise<void>;
  /** Call after onboarding finishes to mark the flag without re-fetching. */
  markOnboardingComplete: () => void;
};

type AuthResponse = {
  token: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  signUp: async () => {},
  logIn: async () => ({ token: '', name: '', email: '', onboardingComplete: false }),
  logOut: async () => {},
  markOnboardingComplete: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore persisted session on launch.
  useEffect(() => {
    (async () => {
      const stored = await loadToken();
      if (stored) {
        try {
          // Validate the token is still good by fetching the profile.
          const profile = await apiRequest<{ age?: string } | null>('/users/me/profile', {
            token: stored,
          });
          // We don't have name/email cached separately, so we decode from the
          // saved user blob. Store a minimal user blob alongside the token.
          const userRaw = await loadUserBlob();
          if (userRaw) {
            setUser({ ...userRaw, onboardingComplete: profile !== null });
            setToken(stored);
          } else {
            await clearToken();
          }
        } catch {
          // Token expired or backend unreachable — clear it.
          await clearToken();
        }
      }
      setLoading(false);
    })();
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const res = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    await saveToken(res.token);
    await saveUserBlob({ name: res.name, email: res.email });
    setToken(res.token);
    setUser({ name: res.name, email: res.email, onboardingComplete: res.onboardingComplete });
  };

  const logIn = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await saveToken(res.token);
    await saveUserBlob({ name: res.name, email: res.email });
    setToken(res.token);
    setUser({ name: res.name, email: res.email, onboardingComplete: res.onboardingComplete });
    return res;
  };

  const logOut = async () => {
    await clearToken();
    await clearUserBlob();
    setToken(null);
    setUser(null);
  };

  const markOnboardingComplete = () => {
    setUser(prev => prev ? { ...prev, onboardingComplete: true } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signUp, logIn, logOut, markOnboardingComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// ── tiny user-blob helpers (name + email cache alongside the token) ───────────

import * as FileSystem from 'expo-file-system';
const USER_PATH = `${(FileSystem as any).documentDirectory}auth-user.json`;

async function saveUserBlob(u: { name: string; email: string }) {
  try { await FileSystem.writeAsStringAsync(USER_PATH, JSON.stringify(u)); } catch {}
}
async function loadUserBlob(): Promise<{ name: string; email: string } | null> {
  try {
    const info = await FileSystem.getInfoAsync(USER_PATH);
    if (!info.exists) return null;
    return JSON.parse(await FileSystem.readAsStringAsync(USER_PATH));
  } catch { return null; }
}
async function clearUserBlob() {
  try {
    const info = await FileSystem.getInfoAsync(USER_PATH);
    if (info.exists) await FileSystem.deleteAsync(USER_PATH);
  } catch {}
}
