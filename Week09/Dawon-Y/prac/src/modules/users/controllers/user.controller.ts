import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Queries,
  Request,
  Response,
  Route,
  Tags,
  SuccessResponse,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto";
import { userSignUp, listMyReviews } from "../services/user.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

interface ListMyReviewsQuery {
  /** 페이지네이션 커서 */
  cursor?: number;
}

/**
 * 유저 관련 API
 */
@Route("users")
@Tags("Users")
export class UserController extends Controller {
  /**
   * 회원가입
   * @summary 새로운 유저를 등록합니다.
   */
  @Post("signup")
  @SuccessResponse("200", "회원가입 성공")
  @Response("409", "이미 존재하는 이메일 (U001)")
  @Response("500", "서버 오류")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);
    return success(await userSignUp(body));
  }

  /**
   * 내 리뷰 목록 조회
   * @summary 특정 멤버의 리뷰 목록을 커서 기반으로 조회합니다.
   */
  @Get("{memberId}/reviews")
  @SuccessResponse("200", "리뷰 목록 조회 성공")
  @Response("404", "존재하지 않는 멤버")
  @Response("500", "서버 오류")
  public async handleListMyReviews(
    @Path() memberId: number,
    @Queries() query: ListMyReviewsQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listMyReviews>>>> {
    return success(await listMyReviews(memberId, query.cursor ?? 0));
  }

  /**
   * 게스트 페이지
   * @summary 로그인 없이 접근 가능한 페이지입니다.
   */
  @Get("guest")
  @SuccessResponse("200", "게스트 페이지 조회 성공")
  public async handleGuestPage(): Promise<String> {
    return `
      <h1>게스트 페이지</h1>
      <p>이 페이지는 로그인이 필요 없습니다.</p>
      <ul>
        <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
      </ul>
    `;
  }

  /**
   * 로그인 페이지
   * @summary 로그인 페이지입니다. 인증 실패 시 리다이렉션됩니다.
   */
  @Get("login")
  @SuccessResponse("200", "로그인 페이지 조회 성공")
  public async handleLoginPage(): Promise<String> {
    return "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>";
  }

  /**
   * 마이페이지
   * @summary 로그인한 유저만 접근 가능한 마이페이지입니다.
   */
  @Get("mypage")
  @Middlewares(authorizeUser())
  @SuccessResponse("200", "마이페이지 조회 성공")
  @Response("401", "인증 실패 - 로그인 필요")
  public async handleMypage(@Request() req: ExpressRequest): Promise<String> {
    return `
      <h1>마이페이지</h1>
      <p>환영합니다, ${req.cookies.username}님!</p>
      <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `;
  }

  /**
   * 로그인 쿠키 생성
   * @summary 테스트용 로그인 쿠키를 생성합니다.
   */
  @Get("set-login")
  @SuccessResponse("200", "로그인 쿠키 생성 성공")
  public async handleSetLogin(@Request() req: ExpressRequest): Promise<String> {
    req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });
    return '로그인 쿠키(username=UMC10th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>';
  }

  /**
   * 로그아웃
   * @summary 로그인 쿠키를 삭제합니다.
   */
  @Get("set-logout")
  @SuccessResponse("200", "로그아웃 성공")
  public async handleSetLogout(@Request() req: ExpressRequest): Promise<String> {
    req.res!.clearCookie("username");
    return '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>';
  }
}