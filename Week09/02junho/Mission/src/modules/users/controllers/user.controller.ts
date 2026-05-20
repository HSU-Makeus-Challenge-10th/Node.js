import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Post,
  Request,
  Response,
  Route,
  Tags,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse, UserUpdateRequest, UserUpdateResponse } from "../dtos/user.dto";
import { userSignUp, userUpdate } from "../services/user.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  /**
   * 회원가입 API
   * @summary 회원가입을 처리하는 엔드포인트입니다.
   */
  @Post("signup")
  @Response<ApiResponse<UserSignUpResponse>>(201, "회원가입 성공")
  @Response<ApiResponse<null>>(409, "이미 존재하는 이메일 (U001)")
  @Response<ApiResponse<null>>(500, "비밀번호 누락 등 서버 에러")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);

    const user = await userSignUp(body);
    this.setStatus(201);
    return success(user);
  }

  /**
   * 내 정보 수정 API (로그인 필요)
   * @summary 로그인한 사용자의 정보를 수정합니다.
   */
  @Patch("me")
  @Middlewares(authorizeUser())
  @Response<ApiResponse<UserUpdateResponse>>(200, "정보 수정 성공")
  @Response<ApiResponse<null>>(401, "로그인이 필요합니다 (AUTH001)")
  public async handleUpdateUser(
    @Request() req: ExpressRequest,
    @Body() body: UserUpdateRequest
  ): Promise<ApiResponse<UserUpdateResponse>> {
    const userId = (req.user as any).id;
    const result = await userUpdate(userId, body);
    return success(result);
  }

  /**
   * 마이페이지 (로그인 필요)
   * @summary JWT 인증된 사용자의 정보를 조회합니다.
   */
  @Get("mypage")
  @Middlewares(authorizeUser())
  @Response<ApiResponse<null>>(401, "로그인이 필요합니다 (AUTH001)")
  public async handleMypage(@Request() req: ExpressRequest): Promise<ApiResponse<any>> {
    const user = req.user as any;
    return success({
      message: `환영합니다, ${user.name}님!`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
      },
    });
  }
}