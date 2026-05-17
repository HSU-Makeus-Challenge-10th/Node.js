import { Body, Controller, Post, Path, Route, Tags } from "tsoa";
import { MissionCreateRequest, MissionChallengeRequest } from "../dtos/mission.dto";
import { addMission, challengeMission } from "../services/mission.service";
import { ApiResponse, success } from "../../../common/responses/response";

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post("{storeId}")
  public async handleCreateMission(
    @Path() storeId: number,
    @Body() body: MissionCreateRequest
  ): Promise<ApiResponse<any>> {
    const result = await addMission(storeId, body);
    this.setStatus(201);
    return success({ message: "미션이 성공적으로 추가되었습니다.", ...result });
  }

  @Post("{missionId}/challenge")
  public async handleStartMissionChallenge(
    @Path() missionId: number,
    @Body() body: MissionChallengeRequest
  ): Promise<ApiResponse<any>> {
    const result = await challengeMission(body.user_id, missionId);
    this.setStatus(201);
    return success({ message: "미션 도전이 시작되었습니다.", ...result });
  }
}