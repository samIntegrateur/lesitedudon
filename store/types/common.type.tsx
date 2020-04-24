export interface ApiStateItem {
  error?: Error | null;
  success?: boolean;
  loading?: boolean;
}

export interface ApiState {
  [key: string]: ApiStateItem;
}
