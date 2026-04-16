import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { addStore, addReview } from "../services/store.service.js";
import { StoreCreateRequest, ReviewCreateRequest } from "../dtos/store.dto.js";

// 1-1. 특정 지역에 가게 추가하기
export const handleCreateStore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = req.body as StoreCreateRequest;

    if (!body.region_id || !body.name || !body.category || !body.owner_number) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "region_id, name, category, owner_number는 필수 항목입니다.",
      });
      return;
    }

    const result = await addStore(body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "가게가 성공적으로 추가되었습니다.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// 1-2. 가게에 리뷰 추가하기
export const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = Number(req.params["storeId"]);
    const body = req.body as ReviewCreateRequest;

    if (!body.user_id || body.rating === undefined || !body.content) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "user_id, rating, content는 필수 항목입니다.",
      });
      return;
    }

    const result = await addReview(storeId, body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "리뷰가 성공적으로 추가되었습니다.",
      data: result,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "존재하지 않는 가게입니다.") {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: err.message,
      });
      return;
    }
    next(err);
  }
};
