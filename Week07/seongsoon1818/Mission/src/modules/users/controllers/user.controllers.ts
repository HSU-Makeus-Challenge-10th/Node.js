import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUserSignUp, UserResponse, type UserSignUpRequest } from "../dtos/user.dtos.js";
import { userSignUp } from "../services/user.services.js";
import { Body, Controller, Post, Route, Tags, SuccessResponse } from "tsoa";
import { successResponse, ApiResponse } from "../../common/dtos/response.dtos.js";


@Route("users")
@Tags("users")
export class UserController extends Controller {
    @SuccessResponse("201", "Created")
    @Post("signup")
    public async handleUserSignUp(
        @Body() body: UserSignUpRequest,
    ): Promise<ApiResponse<UserResponse>> {
        const user = await userSignUp(bodyToUserSignUp(body));

        this.setStatus(201);

        return successResponse(
            "201",
            "회원가입에 성공하였습니다",
            user
        );
    }
}

/*
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
*/