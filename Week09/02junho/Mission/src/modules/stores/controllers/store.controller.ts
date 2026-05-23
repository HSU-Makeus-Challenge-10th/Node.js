import { Body, Controller, Get, Middlewares, Post, Path, Query, Request, Response, Route, Tags } from "tsoa";
import { StoreCreateRequest, ReviewCreateRequest, ReviewListResponse } from "../dtos/store.dto";
import { addStore, addReview, listStoreReviews } from "../services/store.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 가게 등록 API (로그인 필요)
   * @summary 새로운 가게를 등록합니다.
   */
  @Post()
  @Middlewares(authorizeUser())
  @Response<ApiResponse<any>>(201, "가게 등록 성공")
  @Response<ApiResponse<null>>(401, "로그인이 필요합니다 (AUTH001)")
  public async handleCreateStore(
    @Request() req: ExpressRequest,
    @Body() body: StoreCreateRequest
  ): Promise<ApiResponse<any>> {
    const result = await addStore(body);
    this.setStatus(201);
    return success({ message: "가게가 성공적으로 추가되었습니다.", ...result });
  }

  /**
   * 상점 리뷰 목록 조회 API
   * @summary 특정 가게의 리뷰 목록을 커서 기반으로 조회합니다.
   */
  @Get("{storeId}/reviews")
  @Response<ApiResponse<ReviewListResponse>>(200, "상점 리뷰 목록 조회 성공")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor?: number
  ): Promise<ApiResponse<any>> {
    const result = await listStoreReviews(storeId, cursor ?? 0);
    return success(result);
  }

  /**
   * 리뷰 작성 API (로그인 필요)
   * @summary 특정 가게에 리뷰를 작성합니다. user_id는 JWT에서 자동 추출됩니다.
   */
  @Post("{storeId}/reviews")
  @Middlewares(authorizeUser())
  @Response<ApiResponse<any>>(201, "리뷰 작성 성공")
  @Response<ApiResponse<null>>(401, "로그인이 필요합니다 (AUTH001)")
  @Response<ApiResponse<null>>(404, "존재하지 않는 가게 (N001)")
  public async handleCreateReview(
    @Request() req: ExpressRequest,
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest
  ): Promise<ApiResponse<any>> {
    const userId = (req.user as any).id;
    const result = await addReview(storeId, { ...body, user_id: userId });
    this.setStatus(201);
    return success({ message: "리뷰가 성공적으로 추가되었습니다.", ...result });
  }
}