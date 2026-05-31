declare global {
  namespace Express {
    interface Response {
      error: (body: {
        errorCode?: string | null;
        message?: string | null;
        data?: unknown | null;
      }) => void;
    }
  }
}

export {};