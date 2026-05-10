import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Queries,
  Route,
  Tags,
  SuccessResponse,
} from "tsoa";
import { addStore, addReview, addMission, listStoreReviews, listStoreMissions } from "../services/store.service";
import { ApiResponse, success } from "../../../common/responses/response";

interface AddStoreBody { regionId: number; name: string; address: string; }
interface AddReviewBody { memberId: number; body: string; score: number; }
interface AddMissionBody { reward: number; deadline: string; missionSpec: string; }
interface StoreListQuery { cursor?: number; }

@Route("stores")
@Tags("Stores")
export class StoreController extends Controller {
  @Post()
  @SuccessResponse("201", "Created")
  public async handleAddStore(
    @Body() body: AddStoreBody,
  ): Promise<ApiResponse<{ storeId: number }>> {
    this.setStatus(201);
    return success(await addStore(body.regionId, body.name, body.address));
  }

  @Post("{storeId}/reviews")
  @SuccessResponse("201", "Created")
  public async handleAddReview(
    @Path() storeId: number,
    @Body() body: AddReviewBody,
  ): Promise<ApiResponse<{ reviewId: number }>> {
    this.setStatus(201);
    return success(await addReview(storeId, body.memberId, body.body, body.score));
  }

  @Post("{storeId}/missions")
  @SuccessResponse("201", "Created")
  public async handleAddMission(
    @Path() storeId: number,
    @Body() body: AddMissionBody,
  ): Promise<ApiResponse<{ missionId: number }>> {
    this.setStatus(201);
    return success(await addMission(storeId, body.reward, body.deadline, body.missionSpec));
  }

  @Get("{storeId}/reviews")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Queries() query: StoreListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listStoreReviews>>>> {
    return success(await listStoreReviews(storeId, query.cursor ?? 0));
  }

  @Get("{storeId}/missions")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Queries() query: StoreListQuery,
  ): Promise<ApiResponse<Awaited<ReturnType<typeof listStoreMissions>>>> {
    return success(await listStoreMissions(storeId, query.cursor ?? 0));
  }
}