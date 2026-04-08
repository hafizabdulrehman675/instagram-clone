export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};
