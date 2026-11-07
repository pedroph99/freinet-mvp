export type DateInput = string | Date;

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface ErrorResponse {
  error: string;
}