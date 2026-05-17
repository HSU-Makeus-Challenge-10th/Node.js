import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Queries,
  Response,
  Route,
  Tags,
  SuccessResponse,
} from "tsoa";
import { addStore, addReview, addMission, listStoreReviews, listStoreMissions } from "../services/store.service";
import { ApiResponse, success } from "../../../common/responses/response";

interface AddStoreBody {
  /** 지역 ID */
  regionId: number;
  /** 가게 이름 */
  name: string;
  /** 가게 주소 */
  address: string;
}

interface AddReviewBody {
  /** 멤버 ID */
  memberId: number;
  /** 리뷰 내용 */
  body: string;
  /** 점수 (1~5) */
  score: number;
}

interface AddMissionBody {
  /** 보상 포인트 */
  reward: number;
  /** 마감일 */
  deadline: string;
  /** 미션 내용 */
  missionSpec: string;
}

interface StoreListQuery {
  /** 페이지네이션 커서 */
  cursor?: number;
}

/**
 * 가게 관련 API
 */
@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 가게 등록
   * @summary 새로운 가게를 등록합니다.
   */
  @Post()
  @SuccessResponse("201", "가게 등록 성공")
  @Response("500", "서버 오류")
  public async handleAddStore(
    @Body() body: AddStoreBody,
  ): Promise<ApiResponse<{ storeId: number }>> {
    this.setStatus(201);
    return success(await addStore(body.regionId, body.name, body.address));
  }

  /**
   * 리뷰 등록
   * @summary 특정 가게에 리뷰를 등록합니다.
   */
  @Post("{storeId}/reviews")
  @SuccessResponse("201", "리뷰 등록 성공")
  @Response("404", "존재하지 않는 가게 (S001)")
  @Response("500", "서버 오류")
  public async handleAddReview(
    @Path() storeId: number,
    @Body() body: AddReviewBody,
  ): Promise<ApiResponse<{ reviewId: number }>> {
    this.setStatus(201);
    return success(await addReview(storeId, body.memberId, body.body, body.score));
  }

  /**
   * 미션 등록
   * @summary 특정 가게에 미션을 등록합니다.
   */
  @Post("{storeId}/missions")
  @SuccessResponse("201", "미션 등록 성공")
  @Response("404", "존재하지 않는 가게 (S001)")
  @Response("500", "서버 오류")
  public async handleAddMission(
    @Path() storeId: number,
    @Body() body: AddMissionBody,
  ): Promise<ApiResponse<{ missionId: number }>> {
    this.setStatus(201);
    return success(await addMission(storeId, body.reward, body.deadline, body.missionSpec));
  }

  /**
   * 가게 리뷰 목록 조회
   * @summary 특정 가게의 리뷰 목록을 커서 기반으로 조회합니다.
   */
  @Get("{storeId}/reviews")
  @SuccessResponse("200", "리뷰 목록 조회 성공")
  @Response("404", "존재하지 않는 가게 (S001)")
  @Response("500", "서버 오류")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Queries() query: StoreListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listStoreReviews>>>> {
    return success(await listStoreReviews(storeId, query.cursor ?? 0));
  }

  /**
   * 가게 미션 목록 조회
   * @summary 특정 가게의 미션 목록을 커서 기반으로 조회합니다.
   */
  @Get("{storeId}/missions")
  @SuccessResponse("200", "미션 목록 조회 성공")
  @Response("404", "존재하지 않는 가게 (S001)")
  @Response("500", "서버 오류")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Queries() query: StoreListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listStoreMissions>>>> {
    return success(await listStoreMissions(storeId, query.cursor ?? 0));
  }
}