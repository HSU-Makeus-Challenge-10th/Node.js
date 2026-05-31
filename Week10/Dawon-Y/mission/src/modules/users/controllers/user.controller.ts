import {
  Body, Controller, Get, Middlewares, Patch,
  Path, Post, Queries, Request, Response, Route, Tags, SuccessResponse,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse, UserUpdateRequest } from "../dtos/user.dto";
import { userSignUp, userUpdate, listMyReviews } from "../services/user.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

interface ListMyReviewsQuery {
  cursor?: number;
}

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  @Post("signup")
  @SuccessResponse("200", "회원가입 성공")
  @Response("409", "이미 존재하는 이메일 (U001)")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    return success(await userSignUp(body));
  }

  @Patch("me")
  @Middlewares(authorizeUser())
  @SuccessResponse("200", "유저 정보 수정 성공")
  @Response("401", "인증 실패")
  public async handleUserUpdate(
    @Body() body: UserUpdateRequest,
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<any>> {
    const userId = (req.user as any).id;
    return success(await userUpdate(userId, body));
  }

  @Get("{memberId}/reviews")
  @Middlewares(authorizeUser())
  @SuccessResponse("200", "리뷰 목록 조회 성공")
  @Response("401", "인증 실패")
  public async handleListMyReviews(
    @Path() memberId: number,
    @Queries() query: ListMyReviewsQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listMyReviews>>>> {
    return success(await listMyReviews(memberId, query.cursor ?? 0));
  }

  @Get("guest")
  @SuccessResponse("200", "게스트 페이지 조회 성공")
  public async handleGuestPage(): Promise<String> {
    return `<h1>게스트 페이지</h1>`;
  }
}