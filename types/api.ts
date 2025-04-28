export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}