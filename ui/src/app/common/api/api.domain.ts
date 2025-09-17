export interface ApiResponse<T> {
  status: string;
  data?: T; // present only if success
  message?: string; // present only if error
}
