import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export type AuthRole = 'admin' | 'store_owner' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (
    email: string,
    options?: { from?: "admin" | "store" },
  ) => Promise<{ error: string | null }>;
  sendResetCode: (
    email: string,
  ) => Promise<{ error: string | null }>;
  verifyResetCode: (
    email: string,
    code: string,
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readRoleFromMetadata(user: User): AuthRole | null {
  const appRole = user.app_metadata?.role;
  const userRole = user.user_metadata?.role;
  const rawRole =
    typeof appRole === 'string'
      ? appRole
      : typeof userRole === 'string'
        ? userRole
        : undefined;

  if (rawRole === 'admin' || rawRole === 'store_owner' || rawRole === 'user') {
    return rawRole;
  }

  return null;
}

function toAuthUser(user: User): AuthUser | null {
  const role = readRoleFromMetadata(user);
  if (role === null) {
    console.warn('User missing valid role in metadata');
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ? toAuthUser(session.user) : null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? toAuthUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  const resetPassword = async (
    email: string,
    options?: { from?: "admin" | "store" },
  ) => {
    const url = new URL(`${window.location.origin}/reset-password`);
    if (options?.from === "store") {
      url.searchParams.set("from", "store");
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url.toString(),
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  const sendResetCode = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const verifyResetCode = async (email: string, code: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        resetPassword,
        sendResetCode,
        verifyResetCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
