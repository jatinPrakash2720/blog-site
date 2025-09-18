export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
  };
}
