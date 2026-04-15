import { createContext } from 'react';
import type { AuthUser } from '@/types/auth';
import type { Session } from '@supabase/supabase-js';

export interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (
    email: string,
    options?: { from?: 'admin' | 'store' },
  ) => Promise<{ error: string | null }>;
  sendResetCode: (email: string) => Promise<{ error: string | null }>;
  verifyResetCode: (
    email: string,
    code: string,
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
