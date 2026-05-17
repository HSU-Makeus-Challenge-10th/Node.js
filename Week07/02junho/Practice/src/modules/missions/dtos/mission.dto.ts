export interface MissionCreateRequest {
  field: string;
  point: number;
  due_at: string;
  requirement: string;
}

export interface MissionChallengeRequest {
  user_id: number;
}
