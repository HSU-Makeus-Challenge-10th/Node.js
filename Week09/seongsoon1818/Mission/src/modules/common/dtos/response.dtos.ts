export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export const successResponse = <T>(
  code: string,
  message: string,
  result: T
): ApiResponse<T> => {
  return {
    isSuccess: true,
    code,
    message,
    result,
  };
};