import {
  Body, Controller, Get, Middlewares, Path, Post,
  Queries, Request, Response, Route, Tags, SuccessResponse,
} from "tsoa";
import { addStore, addReview, addMission, listStoreReviews, listStoreMissions } from "../services/store.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

interface AddStoreBody {
  regionId: number;
  name: string;
  address: string;
}

interface AddReviewBody {
  body: string;
  score: number;
}

interface AddMissionBody {
  reward: number;
  deadline: string;
  missionSpec: string;
}

interface StoreListQuery {
  cursor?: number;
}

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  @Post()
  @Middlewares(authorizeUser())
  @SuccessResponse("201", "가게 등록 성공")
  @Response("401", "인증 실패")
  public async handleAddStore(
    @Body() body: AddStoreBody,
  ): Promise<ApiResponse<{ storeId: number }>> {
    this.setStatus(201);
    return success(await addStore(body.regionId, body.name, body.address));
  }

  @Post("{storeId}/reviews")
  @Middlewares(authorizeUser())
  @SuccessResponse("201", "리뷰 등록 성공")
  @Response("401", "인증 실패")
  @Response("404", "존재하지 않는 가게 (S001)")
  public async handleAddReview(
    @Path() storeId: number,
    @Body() body: AddReviewBody,
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<{ reviewId: number }>> {
    const memberId = (req.user as any).id;
    this.setStatus(201);
    return success(await addReview(storeId, memberId, body.body, body.score));
  }

  @Post("{storeId}/missions")
  @Middlewares(authorizeUser())
  @SuccessResponse("201", "미션 등록 성공")
  @Response("401", "인증 실패")
  @Response("404", "존재하지 않는 가게 (S001)")
  public async handleAddMission(
    @Path() storeId: number,
    @Body() body: AddMissionBody,
  ): Promise<ApiResponse<{ missionId: number }>> {
    this.setStatus(201);
    return success(await addMission(storeId, body.reward, body.deadline, body.missionSpec));
  }

  @Get("{storeId}/reviews")
  @SuccessResponse("200", "리뷰 목록 조회 성공")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Queries() query: StoreListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listStoreReviews>>>> {
    return success(await listStoreReviews(storeId, query.cursor ?? 0));
  }

  @Get("{storeId}/missions")
  @SuccessResponse("200", "미션 목록 조회 성공")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Queries() query: StoreListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listStoreMissions>>>> {
    return success(await listStoreMissions(storeId, query.cursor ?? 0));
  }
}