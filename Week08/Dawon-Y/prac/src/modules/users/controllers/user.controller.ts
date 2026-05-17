import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Queries,
  Request,
  Route,
  Tags,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto";
import { userSignUp, listMyReviews } from "../services/user.service";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

interface ListMyReviewsQuery {
  cursor?: number;
}

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  @Post("signup")
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<UserSignUpResponse> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);
    return await userSignUp(body);
  }

  @Get("{memberId}/reviews")
  public async handleListMyReviews(
    @Path() memberId: number,
    @Queries() query: ListMyReviewsQuery,
  ): Promise<Awaited<ReturnType<typeof listMyReviews>>> {
    const cursor = query.cursor ?? 0;
    return await listMyReviews(memberId, cursor);
  }

  @Get("guest")
  public async handleGuestPage(): Promise<String> {
    return `
      <h1>게스트 페이지</h1>
      <p>이 페이지는 로그인이 필요 없습니다.</p>
      <ul>
        <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
      </ul>
    `;
  }

  @Get("login")
  public async handleLoginPage(): Promise<String> {
    return "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>";
  }

  @Get("mypage")
  @Middlewares(authorizeUser())
  public async handleMypage(@Request() req: ExpressRequest): Promise<String> {
    return `
      <h1>마이페이지</h1>
      <p>환영합니다, ${req.cookies.username}님!</p>
      <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `;
  }

  @Get("set-login")
  public async handleSetLogin(@Request() req: ExpressRequest): Promise<String> {
    req.res!.cookie("username", "UMC10th", { maxAge: 3600000 });
    return '로그인 쿠키(username=UMC10th) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>';
  }

  @Get("set-logout")
  public async handleSetLogout(@Request() req: ExpressRequest): Promise<String> {
    req.res!.clearCookie("username");
    return '로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>';
  }
}