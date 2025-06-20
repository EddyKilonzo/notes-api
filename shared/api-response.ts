/* eslint-disable prettier/prettier */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}
