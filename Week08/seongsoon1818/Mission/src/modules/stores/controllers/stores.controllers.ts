import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToCreateStoreReview, CreateStoreReviewRequest, StoreReviewResponse } from "../dtos/stores.dtos.js";
import { createStoreReview } from "../services/stores.services.js";
import { bodyToCreateStoreMission, CreateStoreMissionData, CreateStoreMissionRequest, queryToStoreMissionList, StoreMissionListResponse, StoreMissionResponse } from "../../missions/dtos/mission.dtos.js";
import { createStoreMission, getStoreMissionList } from "../../missions/services/mission.services.js";
import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse, Tags } from "tsoa";
import { successResponse, ApiResponse } from "../../common/dtos/response.dtos.js";

@Route("stores")
@Tags("Stores")
export class StoreContoller extends Controller {
  @SuccessResponse("201", "Created")
  @Post("{storeId}/reives")
  public async handleCreateStoreReview(
    @Path() storeId : number,
    @Body() body : CreateStoreReviewRequest
  ): Promise<ApiResponse<StoreReviewResponse>> {
    const review = await createStoreReview(
      bodyToCreateStoreReview(String(storeId), body)
    );

    this.setStatus(201);

    return successResponse(
      "201",
      "가게 리뷰를 작성하였습니다.",
      review
    );
  }

  @SuccessResponse("200", "Ok")
  @Get("{storeId}/show-missions")
  public async handleGetStoreMissions(
    @Path() storeId : number,
    @Query() page? : number,
    @Query() limit? : number
  ): Promise<ApiResponse<StoreMissionListResponse>> {
    const result = await getStoreMissionList(
      queryToStoreMissionList(String(storeId), {
        page : page ?? 1,
        limit : limit ?? 5
      })
    );

    return successResponse(
      "200",
      "미션 목록을 조회하였습니다.",
      result
    );
  }

  @SuccessResponse("201", "Created")
  @Post("{storeId}/missions")
  public async handleCreateStoreMission(
    @Path() storeId : number,
    @Body() body : CreateStoreMissionRequest
  ): Promise<ApiResponse<StoreMissionResponse>> {
    const mission = await createStoreMission(
      bodyToCreateStoreMission(String(storeId), body)
    );

    this. setStatus(201);

    return successResponse(
      "201",
      "가게 미션을 추가하였습니다.",
      mission
    );
  }
}

/*
interface CreateStoreReviewParams {
  storeId: string;
}

export const handleCreateStoreReview = async (
  req: Request<CreateStoreReviewParams, unknown, CreateStoreReviewRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await createStoreReview(
      bodyToCreateStoreReview(req.params.storeId, req.body)
    );

    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code: "201",
      message: "가게 리뷰를 작성하였습니다.",
      result: review,
    });
  } catch (error) {
    next(error);
  }
};


interface StoreMissionParams {
  storeId: string;
}

export const handleGetStoreMissions = async (
  req: Request<StoreMissionParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = queryToStoreMissionList(req.params.storeId, req.query);

    const result = await getStoreMissionList(data)

    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: 200,
      message: "미션 목록을 조회하였습니다.",
      result
    });
  } catch (error) {
    next(error)
  }
}
  
*/