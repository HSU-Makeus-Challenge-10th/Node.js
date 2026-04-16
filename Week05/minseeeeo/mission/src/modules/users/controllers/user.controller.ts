import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser, UserSignUpRequest } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as UserSignUpRequest;

    if (!body.email || !body.name || !body.gender || !body.birth || !body.phone || !body.password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "email, name, gender, birth, phone, password는 필수 항목입니다.",
      });
      return;
    }

    const user = await userSignUp(bodyToUser(body));
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: user,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "이미 존재하는 이메일입니다.") {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: err.message,
      });
      return;
    }
    next(err);
  }
};
