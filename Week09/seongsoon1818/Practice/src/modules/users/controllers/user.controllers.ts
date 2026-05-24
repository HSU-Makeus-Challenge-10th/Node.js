import type { Request as ExpressRequest, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUserSignUp, UserResponse, bodyToUserProfileSetup, type UserSignUpRequest, UserProFileSetupRequest } from "../dtos/user.dtos.js";
import { userSignUp, updateMyProfile } from "../services/user.services.js";
import { Body, Controller, Post, Route, Tags, SuccessResponse, Security, Request as TsoaRequest, Patch } from "tsoa";
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

    @SuccessResponse("200", "OK")
    @Security("jwt")
    @Patch("/profile/setup")
    public async handleUpdateMyProfile(
        @TsoaRequest() req: ExpressRequest,
        @Body() body: UserProFileSetupRequest
    ): Promise<ApiResponse<UserResponse>> {
        const loginUser = (req as any).user as {
            id: string;
            email: string;
            loginId: string;
        };

        const user = await updateMyProfile(
            loginUser.id,
            bodyToUserProfileSetup(body)
        );

        this.setStatus(200);

        return successResponse(
            "200",
            "회원 정보를 수정했습니다.",
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