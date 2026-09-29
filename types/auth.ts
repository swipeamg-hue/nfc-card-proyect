export type UserRole = 'SUPER_ADMIN' | 'CLIENT';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string; // ID of the business this client owns
  businessSlug?: string;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
