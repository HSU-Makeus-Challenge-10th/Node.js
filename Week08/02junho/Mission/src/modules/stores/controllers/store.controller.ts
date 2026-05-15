import { Body, Controller, Get, Post, Path, Query, Response, Route, Tags } from "tsoa";
import { StoreCreateRequest, ReviewCreateRequest, ReviewListResponse } from "../dtos/store.dto";
import { addStore, addReview, listStoreReviews } from "../services/store.service";
import { ApiResponse, success } from "../../../common/responses/response";

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 가게 등록 API
   * @summary 새로운 가게를 등록합니다.
   */
  @Post()
  @Response<ApiResponse<any>>(201, "가게 등록 성공")
  public async handleCreateStore(@Body() body: StoreCreateRequest): Promise<ApiResponse<any>> {
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
   * 리뷰 작성 API
   * @summary 특정 가게에 리뷰를 작성합니다.
   */
  @Post("{storeId}/reviews")
  @Response<ApiResponse<any>>(201, "리뷰 작성 성공")
  @Response<ApiResponse<null>>(404, "존재하지 않는 가게 (N001)")
  public async handleCreateReview(
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest
  ): Promise<ApiResponse<any>> {
    const result = await addReview(storeId, body);
    this.setStatus(201);
    return success({ message: "리뷰가 성공적으로 추가되었습니다.", ...result });
  }
}