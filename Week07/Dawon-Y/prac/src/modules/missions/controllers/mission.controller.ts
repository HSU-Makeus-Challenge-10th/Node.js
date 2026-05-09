import { Body, Controller, Get, Patch, Path, Post, Queries, Route, Tags, SuccessResponse } from "tsoa";
import { challengeMission, listOngoingMissions, updateMissionComplete } from "../services/mission.service";

interface ChallengeMissionBody {
  memberId: number;
}

interface ListOngoingMissionsQuery {
  cursor?: number;
}

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post("{missionId}/challenge")
  @SuccessResponse("201", "Created")
  public async handleChallengeMission(
    @Path() missionId: number,
    @Body() body: ChallengeMissionBody,
  ): Promise<{ result: Awaited<ReturnType<typeof challengeMission>> }> {
    this.setStatus(201);
    const result = await challengeMission(body.memberId, missionId);
    return { result };
  }
}

@Route("members")
@Tags("Members")
export class MemberMissionController extends Controller {
  @Get("{memberId}/missions")
  public async handleListOngoingMissions(
    @Path() memberId: number,
    @Queries() query: ListOngoingMissionsQuery,
  ): Promise<Awaited<ReturnType<typeof listOngoingMissions>>> {
    const cursor = query.cursor ?? 0;
    return await listOngoingMissions(memberId, cursor);
  }
}

@Route("member-missions")
@Tags("MemberMissions")
export class MemberMissionCompleteController extends Controller {
  @Patch("{memberMissionId}/complete")
  public async handleCompleteMission(
    @Path() memberMissionId: number,
  ): Promise<{ result: Awaited<ReturnType<typeof updateMissionComplete>> }> {
    const result = await updateMissionComplete(memberMissionId);
    return { result };
  }
}