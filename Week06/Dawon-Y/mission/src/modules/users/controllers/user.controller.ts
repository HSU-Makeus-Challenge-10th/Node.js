import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, listMyReviews } from "../services/user.service.js";

export const handleUserSignUp = async (req: Request, res: Response, next: NextFunction) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body);
  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};

export const handleListMyReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = parseInt(req.params.memberId as string, 10);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;
    const reviews = await listMyReviews(memberId, cursor);
    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    next(err);
  }
};