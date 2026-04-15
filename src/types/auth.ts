export type AuthRole = 'admin' | 'store_owner' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
}
