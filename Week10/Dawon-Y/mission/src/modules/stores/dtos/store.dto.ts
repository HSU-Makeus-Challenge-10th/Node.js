export interface AddStoreRequest {
  regionId: number;
  name: string;
  address: string;
}

export interface AddReviewRequest {
  memberId: number;
  body: string;
  score: number;
}

export interface AddMissionRequest {
  reward: number;
  deadline: string;
  missionSpec: string;
}