export interface MissionCreateRequest {
  /** 미션 분야 */
  field: string;
  /** 미션 포인트 */
  point: number;
  /** 미션 마감일 (예: 2025-12-31) */
  due_at: string;
  /** 미션 요구사항 */
  requirement: string;
}

export interface MissionChallengeRequest {
  /** 도전하는 유저 ID */
  user_id: number;
}