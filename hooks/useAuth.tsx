import React, { createContext, useContext, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

export type User = {
  name: string;
  email: string;
};

type StoredAccount = User & { password: string };

type AuthStore = {
  accounts: StoredAccount[];
  currentEmail: string | null;
};

type AuthContextValue = {
  user: User | null;
  /** True until the persisted session has been loaded from disk. */
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const FILE_PATH = `${(FileSystem as any).documentDirectory}auth-data.json`;
const EMPTY_STORE: AuthStore = { accounts: [], currentEmail: null };

const normalize = (email: string) => email.trim().toLowerCase();

async function readStore(): Promise<AuthStore> {
  try {
    const info = await FileSystem.getInfoAsync(FILE_PATH);
    if (!info.exists) return EMPTY_STORE;
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(raw) as AuthStore;
  } catch {
    return EMPTY_STORE;
  }
}

async function writeStore(store: AuthStore): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(store));
  } catch {
    // best-effort persistence
  }
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signUp: async () => {},
  logIn: async () => {},
  logOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore any persisted session on launch.
  useEffect(() => {
    (async () => {
      const store = await readStore();
      if (store.currentEmail) {
        const acct = store.accounts.find(a => a.email === store.currentEmail);
        if (acct) setUser({ name: acct.name, email: acct.email });
      }
      setLoading(false);
    })();
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const e = normalize(email);
    const store = await readStore();
    if (store.accounts.some(a => a.email === e)) {
      throw new Error('An account with this email already exists.');
    }
    const acct: StoredAccount = { name: name.trim(), email: e, password };
    const next: AuthStore = {
      accounts: [...store.accounts, acct],
      currentEmail: e,
    };
    await writeStore(next);
    setUser({ name: acct.name, email: acct.email });
  };

  const logIn = async (email: string, password: string) => {
    const e = normalize(email);
    const store = await readStore();
    const acct = store.accounts.find(a => a.email === e);
    if (!acct || acct.password !== password) {
      throw new Error('Incorrect email or password.');
    }
    await writeStore({ ...store, currentEmail: e });
    setUser({ name: acct.name, email: acct.email });
  };

  const logOut = async () => {
    const store = await readStore();
    await writeStore({ ...store, currentEmail: null });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
