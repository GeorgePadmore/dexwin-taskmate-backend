export interface ApiResponse<T = any> {
  response_code: string;
  response_desc: string;
  success: boolean;
  data: T;
}
