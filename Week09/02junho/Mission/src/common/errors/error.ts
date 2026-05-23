import { AppError } from "./app.error";

export class DuplicateUserEmailError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "U001",
      statusCode: 409,
      message,
      data,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "N001",
      statusCode: 404,
      message,
      data,
    });
  }
}

export class AlreadyExistsError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "C001",
      statusCode: 409,
      message,
      data,
    });
  }
}