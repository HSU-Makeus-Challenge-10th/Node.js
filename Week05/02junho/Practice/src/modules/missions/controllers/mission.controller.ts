import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { addMission, challengeMission } from "../services/mission.service.js";
import { MissionCreateRequest, MissionChallengeRequest } from "../dtos/mission.dto.js";

// 1-3. 가게에 미션 추가하기
export const handleCreateMission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = Number(req.params["storeId"]);
    const body = req.body as MissionCreateRequest;

    if (!body.field || body.point === undefined || !body.due_at || !body.requirement) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "field, point, due_at, requirement는 필수 항목입니다.",
      });
      return;
    }

    const result = await addMission(storeId, body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "미션이 성공적으로 추가되었습니다.",
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

// 1-4. 가게의 미션을 도전 중인 미션에 추가 (미션 도전하기)
export const handleStartMissionChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const missionId = Number(req.params["missionId"]);
    const body = req.body as MissionChallengeRequest;

    if (!body.user_id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "user_id는 필수 항목입니다.",
      });
      return;
    }

    const result = await challengeMission(body.user_id, missionId);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "미션 도전이 시작되었습니다.",
      data: result,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "존재하지 않는 미션입니다.") {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: err.message });
        return;
      }
      if (err.message === "이미 도전 중인 미션입니다.") {
        res.status(StatusCodes.CONFLICT).json({ success: false, message: err.message });
        return;
      }
    }
    next(err);
  }
};
