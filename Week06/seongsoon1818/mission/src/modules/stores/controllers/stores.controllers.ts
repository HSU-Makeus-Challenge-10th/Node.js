import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToCreateStoreReview, CreateStoreReviewRequest } from "../dtos/stores.dtos.js";
import { createStoreReview } from "../services/stores.services.js";
import { queryToStoreMissionList } from "../../missions/dtos/mission.dtos.js";
import { getStoreMissionList } from "../../missions/services/mission.services.js";

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