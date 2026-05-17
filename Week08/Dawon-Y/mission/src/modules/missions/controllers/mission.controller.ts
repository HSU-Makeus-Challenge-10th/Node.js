import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Queries,
  Response,
  Route,
  Tags,
  SuccessResponse,
} from "tsoa";
import { challengeMission, listOngoingMissions, updateMissionComplete } from "../services/mission.service";
import { ApiResponse, success } from "../../../common/responses/response";

interface ChallengeMissionBody {
  /** 멤버 ID */
  memberId: number;
}

interface MissionListQuery {
  /** 페이지네이션 커서 */
  cursor?: number;
}

/**
 * 미션 도전 관련 API
 */
@Route("missions")
@Tags("Missions")
export class MissionController extends Controller {
  /**
   * 미션 도전
   * @summary 특정 미션에 도전합니다.
   */
  @Post("{missionId}/challenge")
  @SuccessResponse("201", "미션 도전 성공")
  @Response("409", "이미 도전 중인 미션 (M001)")
  @Response("500", "서버 오류")
  public async handleChallengeMission(
    @Path() missionId: number,
    @Body() body: ChallengeMissionBody,
  ): Promise<ApiResponse<{ memberMissionId: number }>> {
    this.setStatus(201);
    return success(await challengeMission(body.memberId, missionId));
  }
}

/**
 * 멤버 미션 관련 API
 */
@Route("members")
@Tags("Members")
export class MemberMissionController extends Controller {
  /**
   * 진행 중인 미션 목록 조회
   * @summary 특정 멤버의 진행 중인 미션 목록을 커서 기반으로 조회합니다.
   */
  @Get("{memberId}/missions")
  @SuccessResponse("200", "미션 목록 조회 성공")
  @Response("404", "존재하지 않는 멤버")
  @Response("500", "서버 오류")
  public async handleListOngoingMissions(
    @Path() memberId: number,
    @Queries() query: MissionListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listOngoingMissions>>>> {
    return success(await listOngoingMissions(memberId, query.cursor ?? 0));
  }
}

/**
 * 멤버 미션 완료 관련 API
 */
@Route("member-missions")
@Tags("MemberMissions")
export class MemberMissionCompleteController extends Controller {
  /**
   * 미션 완료 처리
   * @summary 진행 중인 미션을 완료 상태로 변경합니다.
   */
  @Patch("{memberMissionId}/complete")
  @SuccessResponse("200", "미션 완료 처리 성공")
  @Response("404", "존재하지 않는 멤버 미션")
  @Response("500", "서버 오류")
  public async handleCompleteMission(
    @Path() memberMissionId: number,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof updateMissionComplete>>>> {
    return success(await updateMissionComplete(memberMissionId));
  }
}