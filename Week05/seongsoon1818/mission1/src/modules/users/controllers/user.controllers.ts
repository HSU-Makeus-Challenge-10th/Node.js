import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUserSignUp, type UserSignUpRequest } from "../dtos/user.dtos.js";
import { userSignUp } from "../services/user.services.js";

export const handleUserSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userSignUp(bodyToUserSignUp(req.body as UserSignUpRequest));

        res.status(StatusCodes.CREATED).json({
            isSuccess : true,
            code: "201",
            message: "회원가입에 성공하였습니다.",
            result: user
        });
    } catch (error) {
        next(error);
    }
}