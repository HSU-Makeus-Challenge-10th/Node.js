import { Body, Controller, Get, Patch, Path, Post, Queries, Route, Tags, SuccessResponse } from "tsoa";
import { challengeMission, listOngoingMissions, updateMissionComplete } from "../services/mission.service";
import { ApiResponse, success } from "../../../common/responses/response";

interface ChallengeMissionBody { memberId: number; }
interface MissionListQuery { cursor?: number; }

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post("{missionId}/challenge")
  @SuccessResponse("201", "Created")
  public async handleChallengeMission(
    @Path() missionId: number,
    @Body() body: ChallengeMissionBody,
  ): Promise<ApiResponse<{ memberMissionId: number }>> {
    this.setStatus(201);
    return success(await challengeMission(body.memberId, missionId));
  }
}

@Route("members")
@Tags("Members")
export class MemberMissionController extends Controller {
  @Get("{memberId}/missions")
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
  public async handleCompleteMission(
    @Path() memberMissionId: number,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof updateMissionComplete>>>> {
    return success(await updateMissionComplete(memberMissionId));
  }
}