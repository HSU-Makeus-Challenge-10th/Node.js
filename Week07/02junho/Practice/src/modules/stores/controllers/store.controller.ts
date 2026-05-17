import { Body, Controller, Get, Post, Path, Query, Route, Tags } from "tsoa";
import { StoreCreateRequest, ReviewCreateRequest } from "../dtos/store.dto";
import { addStore, addReview, listStoreReviews } from "../services/store.service";
import { ApiResponse, success } from "../../../common/responses/response";

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  @Post()
  public async handleCreateStore(@Body() body: StoreCreateRequest): Promise<ApiResponse<any>> {
    const result = await addStore(body);
    this.setStatus(201);
    return success({ message: "가게가 성공적으로 추가되었습니다.", ...result });
  }

  @Get("{storeId}/reviews")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor?: number
  ): Promise<ApiResponse<any>> {
    const result = await listStoreReviews(storeId, cursor ?? 0);
    return success(result);
  }

  @Post("{storeId}/reviews")
  public async handleCreateReview(
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest
  ): Promise<ApiResponse<any>> {
    const result = await addReview(storeId, body);
    this.setStatus(201);
    return success({ message: "리뷰가 성공적으로 추가되었습니다.", ...result });
  }
}