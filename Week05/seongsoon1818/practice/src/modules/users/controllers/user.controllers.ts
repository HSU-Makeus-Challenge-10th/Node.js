import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { BodyToUser } from "../dtos/user.dtos.js";
import { userSignUp } from "../services/user.services.js";
import { UserSignUpRequset } from "../dtos/user.dtos.js";

export const handleUserSignUp = async (req: Request, res: Response, nest: NextFunction) => {
    console.log("회원가입을 요청하였습니다.");
    console.log("body: ", req.body)

    const user = await userSignUp(BodyToUser(req.body as UserSignUpRequset));

    res.status(StatusCodes.CREATED).json({result: user});
}