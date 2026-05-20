import { Body, Controller, Middlewares, Post, Path, Request, Response, Route, Tags } from "tsoa";
import { MissionCreateRequest } from "../dtos/mission.dto";
import { addMission, challengeMission } from "../services/mission.service";
import { ApiResponse, success } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";

@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  /**
   * 미션 등록 API (로그인 필요)
   * @summary 특정 가게에 미션을 등록합니다.
   */
  @Post("{storeId}")
  @Middlewares(authorizeUser())
  @Response<ApiResponse<any>>(201, "미션 등록 성공")
  @Response<ApiResponse<null>>(401, "로그인이 필요합니다 (AUTH001)")
  @Response<ApiResponse<null>>(404, "존재하지 않는 가게 (N001)")
  public async handleCreateMission(
    @Request() req: ExpressRequest,
    @Path() storeId: number,
    @Body() body: MissionCreateRequest
  ): Promise<ApiResponse<any>> {
    const result = await addMission(storeId, body);
    this.setStatus(201);
    return success({ message: "미션이 성공적으로 추가되었습니다.", ...result });
  }

  /**
   * 미션 도전 API (로그인 필요)
   * @summary 특정 미션에 도전을 시작합니다. user_id는 JWT에서 자동 추출됩니다.
   */
  @Post("{missionId}/challenge")
  @Middlewares(authorizeUser())
  @Response<ApiResponse<any>>(201, "미션 도전 시작 성공")
  @Response<ApiResponse<null>>(401, "로그인이 필요합니다 (AUTH001)")
  @Response<ApiResponse<null>>(404, "존재하지 않는 미션 (N001)")
  @Response<ApiResponse<null>>(409, "이미 도전 중인 미션 (C001)")
  public async handleStartMissionChallenge(
    @Request() req: ExpressRequest,
    @Path() missionId: number
  ): Promise<ApiResponse<any>> {
    const userId = (req.user as any).id;
    const result = await challengeMission(userId, missionId);
    this.setStatus(201);
    return success({ message: "미션 도전이 시작되었습니다.", ...result });
  }
}