// 1-3. 미션 추가 요청 DTO
export interface MissionCreateRequest {
  field: string;
  point: number;
  due_at: string;
  requirement: string;
}

// 1-4. 미션 도전 요청 DTO
export interface MissionChallengeRequest {
  user_id: number;
}
