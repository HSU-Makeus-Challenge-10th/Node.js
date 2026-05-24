import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToCreateStoreMission, CreateStoreMissionRequest, queryToOngoingMissionList,
  bodyToStartMissionChallenge, StartMissionChallengeRequest, paramsToCompleteMissionChallenge, 
  UserMissionResponse,
  OngoingMissionListResponse} from "../dtos/mission.dtos.js";
import { createStoreMission, getOngoingMissionList, completeMissionChallenge } from "../services/mission.services.js";
import { startMissionChallenge } from "../services/mission.services.js";
import { Body, Controller, Get, Patch, Path, Post, Query, Route, SuccessResponse, Tags } from "tsoa";
import { successResponse, ApiResponse } from "../../common/dtos/response.dtos.js";

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  @SuccessResponse("201, Created")
  @Post("{missionId}/challenges")
  public async handleStartMissionChallenge(
    @Path() missionId : number,
    @Body() body : StartMissionChallengeRequest
  ): Promise<ApiResponse<UserMissionResponse>> {
    const userMission = await startMissionChallenge(
      bodyToStartMissionChallenge(String(missionId), body)
    );

    this.setStatus(201);

    return successResponse(
      "201",
      "도전 중인 미션에 추가하였습니다.",
      userMission
    );
  }

  @SuccessResponse("200", "Ok")
  @Get("{userId}/ongoing")
  public async handleGetOngoingMissions(
    @Path() userId : number,
    @Query() page? : number,
    @Query() limit? : number
  ): Promise<ApiResponse<OngoingMissionListResponse>> {
    const result = await getOngoingMissionList(
      queryToOngoingMissionList(String(userId), {
        page : page ?? 1,
        limit : limit ?? 5,
      })
    );

    return successResponse(
      "200",
      "진행 중인 미션 목록을 조회하였습니다.",
      result
    );
  }

  @SuccessResponse("200", "Ok")
  @Patch("{userId}/{missionId}/tocomplete")
  public async handleCompleteMissionChallenge(
    @Path() userId : number,
    @Path() missionId : number,
  ): Promise<ApiResponse<UserMissionResponse>> {
    const result = await completeMissionChallenge(
      paramsToCompleteMissionChallenge(
        String(userId),
        String(missionId)
      )
    );

    return successResponse(
      "200",
      "미션을 완료 처리했습니다.",
      result
    )
  }
}

/*
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


interface OngoingMissionParams {
  userId: string;
}

export const handleGetOngoingMissions = async (
  req: Request<OngoingMissionParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = queryToOngoingMissionList(req.params.userId, req.query);

    const result = await getOngoingMissionList(data);

    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: 200,
      message: "진행 중인 미션 목록을 조회하였습니다.",
      result,
    });
  } catch (error) {
    next(error);
  }
};


interface CompleteMissionParams {
  userId: string;
  missionId: string;
}

export const handleCompleteMissionChallenge = async (
  req: Request<CompleteMissionParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = paramsToCompleteMissionChallenge(
      req.params.userId,
      req.params.missionId
    );

    const result = await completeMissionChallenge(data);

    res.status(StatusCodes.OK).json({
      isSuccess: true,
      code: 200,
      message: "미션을 완료 처리하였습니다.",
      result,
    });
  } catch (error) {
    next(error);
  }
};
*/