import {
  Body, Controller, Get, Middlewares, Patch,
  Path, Post, Queries, Request, Response, Route, Tags, SuccessResponse,
} from "tsoa";
import { challengeMission, listOngoingMissions, updateMissionComplete } from "../services/mission.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

interface MissionListQuery {
  cursor?: number;
}

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post("{missionId}/challenge")
  @Middlewares(authorizeUser())
  @SuccessResponse("201", "미션 도전 성공")
  @Response("401", "인증 실패")
  @Response("409", "이미 도전 중인 미션 (M001)")
  public async handleChallengeMission(
    @Path() missionId: number,
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<{ memberMissionId: number }>> {
    const memberId = (req.user as any).id;
    this.setStatus(201);
    return success(await challengeMission(memberId, missionId));
  }
}

@Route("members")
@Tags("Members")
export class MemberMissionController extends Controller {
  @Get("{memberId}/missions")
  @Middlewares(authorizeUser())
  @SuccessResponse("200", "미션 목록 조회 성공")
  @Response("401", "인증 실패")
  public async handleListOngoingMissions(
    @Path() memberId: number,
    @Queries() query: MissionListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listOngoingMissions>>>> {
    return success(await listOngoingMissions(memberId, query.cursor ?? 0));
  }
}

@Route("member-missions")
@Tags("MemberMissions")
export class MemberMissionCompleteController extends Controller {
  @Patch("{memberMissionId}/complete")
  @Middlewares(authorizeUser())
  @SuccessResponse("200", "미션 완료 처리 성공")
  @Response("401", "인증 실패")
  public async handleCompleteMission(
    @Path() memberMissionId: number,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof updateMissionComplete>>>> {
    return success(await updateMissionComplete(memberMissionId));
  }
}