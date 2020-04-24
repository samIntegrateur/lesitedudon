
export interface AuthState {
  token: string | null;
  userId: string | null;
  error: Error | null;
  loading: boolean;
  firstCheck: boolean;
}
