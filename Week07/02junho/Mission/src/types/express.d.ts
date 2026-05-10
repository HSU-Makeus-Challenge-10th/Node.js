import "express";

declare module "express" {
  interface Response {
    error: (params: {
      errorCode?: string | null;
      message?: string | null;
      data?: any;
    }) => Response;
  }
}