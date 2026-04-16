import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToCreateStoreMission, CreateStoreMissionRequest } from "../dtos/mission.dtos.js";
import { createStoreMission } from "../services/mission.services.js";
import { bodyToStartMissionChallenge, StartMissionChallengeRequest } from "../dtos/mission.dtos.js";
import { startMissionChallenge } from "../services/mission.services.js";

interface CreateStoreMissionParams {
    storeId : string
}

export const handleCreateStoreMission = async (
  req: Request<CreateStoreMissionParams, unknown, CreateStoreMissionRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const mission = await createStoreMission(
      bodyToCreateStoreMission(req.params.storeId, req.body)
    );

    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code: "201",
      message: "가게 미션을 추가하였습니다.",   
      result: mission,
    });
  } catch (error) {
    next(error);
  }
};

interface StartMissionChallengeParams {
  missionId: string;
}

export const handleStartMissionChallenge = async (
  req: Request<StartMissionChallengeParams, unknown, StartMissionChallengeRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userMission = await startMissionChallenge(
      bodyToStartMissionChallenge(req.params.missionId, req.body)
    );

    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      code: "201",
      message: "도전 중인 미션에 추가하였습니다.",
      result: userMission,
    });
  } catch (error) {
    next(error);
  }
};