export interface CreateStoreMissionRequest {
  title: string
  description?: string
  point: number
  expired_date: string
}

export interface CreateStoreMissionData {
  store_id: number
  title: string
  description: string
  point: number
  expired_date: string
}

export interface StoreMissionResponse {
  id: number
  store_id: number
  store_name: string
  title: string
  description: string
  point: number
  reg_date: Date
  expired_date: Date
  status: string
}

export const bodyToCreateStoreMission = (
  storeIdParam: string,
  body: CreateStoreMissionRequest
): CreateStoreMissionData => {
  return {
    store_id: Number(storeIdParam),
    title: (body.title ?? "").trim(),
    description: (body.description ?? "").trim(),
    point: Number(body.point),
    expired_date: body.expired_date,
  }
}

export const responseFromStoreMission = (mission: any): StoreMissionResponse => {
  return {
    id: mission.id,
    store_id: mission.store_id,
    store_name: mission.store_name,
    title: mission.title,
    description: mission.description,
    point: mission.point,
    reg_date: mission.reg_date,
    expired_date: mission.expired_date,
    status: mission.status,
  }
}

export interface StartMissionChallengeRequest {
  user_id: number
}

export interface StartMissionChallengeData {
  mission_id: number
  user_id: number
}

export interface UserMissionResponse {
  id: number
  mission_id: number
  mission_title: string
  store_id: number
  store_name: string
  user_id: number
  user_login_id: string
  expired_date: string
  complete_date: string | null
  status: string
}

const formatDateTime = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
};

export const bodyToStartMissionChallenge = (
  missionIdParam: string,
  body: StartMissionChallengeRequest
): StartMissionChallengeData => {
  return {
    mission_id: Number(missionIdParam),
    user_id: Number(body.user_id),
  };
};

export const responseFromUserMission = (userMission: any): UserMissionResponse => {
  return {
    id: userMission.id,
    mission_id: userMission.mission_id,
    mission_title: userMission.mission_title,
    store_id: userMission.store_id,
    store_name: userMission.store_name,
    user_id: userMission.user_id,
    user_login_id: userMission.user_login_id,
    expired_date: formatDateTime(userMission.expired_date),
    complete_date: userMission.complete_date
      ? formatDateTime(userMission.complete_date)
      : null,
    status: userMission.status,
  };
};