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
  id: string;
  store_id: string;
  store_name: string;
  title: string;
  description: string;
  point: number;
  reg_date: string;
  expired_date: string;
  status: string;
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
    id: mission.id.toString(),
    store_id: mission.store_id.toString(),
    store_name: mission.store_name,
    title: mission.title,
    description: mission.description,
    point: mission.point,
    reg_date: formatDateTime(mission.reg_date),
    expired_date: formatDateTime(mission.expired_date),
    status: mission.status,
  };
};

export interface StartMissionChallengeRequest {
  user_id: number
}

export interface StartMissionChallengeData {
  mission_id: number
  user_id: number
}

export interface UserMissionResponse {
  id: string
  mission_id: string
  mission_title: string
  store_id: string
  store_name: string
  user_id: string
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
    id: userMission.id.toString(),
    mission_id: userMission.mission_id.toString(),
    mission_title: userMission.mission_title,
    store_id: userMission.store_id.toString(),
    store_name: userMission.store_name,
    user_id: userMission.user_id.toString(),
    user_login_id: userMission.user_login_id,
    expired_date: formatDateTime(userMission.expired_date),
    complete_date: userMission.complete_date
      ? formatDateTime(userMission.complete_date)
      : null,
    status: userMission.status,
  };
};



export interface StoreMissionListQuery {
  page: number;
  limit: number;
}

export interface StoreMissionListData {
  store_id: number;
  page: number;
  limit: number;
}

export interface StoreMissionListItem {
  id: string;
  store_id: string;
  title: string;
  description: string;
  point: number;
  reg_date: string;
  expired_date: string;
  status: string;
}

export interface StoreMissionListResponse {
  store: {
    id: string;
    name: string;
    address: string;
    region_id: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
  missions: StoreMissionListItem[];
}

export const queryToStoreMissionList = (
  storeIdParam: string,
  query: any
): StoreMissionListData => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  return {
    store_id: Number(storeIdParam),
    page,
    limit,
  };
};

export const responseFromStoreMissionList = (
  store: any,
  missions: any[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): StoreMissionListResponse => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return {
    store: {
      id: store.id.toString(),
      name: store.name,
      address: store.address,
      region_id: store.region_id,
    },
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
    },
    missions: missions.map((mission) => ({
      id: mission.id.toString(),
      store_id: mission.store_id.toString(),
      title: mission.title,
      description: mission.description,
      point: mission.point,
      reg_date: formatDateTime(mission.reg_date),
      expired_date: formatDateTime(mission.expired_date),
      status: mission.status,
    })),
  };
};



export interface OngoingMissionListData {
  user_id: number;
  page: number;
  limit: number;
}

export interface OngoingMissionListItem {
  id: string;
  user_id: string;
  mission_id: string;
  mission_title: string;
  mission_description: string;
  point: number;
  store_id: string;
  store_name: string;
  store_address: string;
  expired_date: string;
  complete_date: string | null;
  status: string;
}

export interface OngoingMissionListResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
  missions: OngoingMissionListItem[];
}

export const queryToOngoingMissionList = (
  userIdParam: string,
  query: any
): OngoingMissionListData => {
  return {
    user_id: Number(userIdParam),
    page: Number(query.page ?? 1),
    limit: Number(query.limit ?? 10),
  };
};

export const responseFromOngoingMissionList = (
  userMissions: any[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): OngoingMissionListResponse => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return {
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
    },
    missions: userMissions.map((mission) => ({
      id: mission.id.toString(),
      user_id: mission.user_id.toString(),
      mission_id: mission.mission_id.toString(),
      mission_title: mission.mission_title,
      mission_description: mission.mission_description,
      point: mission.point,
      store_id: mission.store_id.toString(),
      store_name: mission.store_name,
      store_address: mission.store_address,
      expired_date: formatDateTime(mission.expired_date),
      complete_date: mission.complete_date
        ? formatDateTime(mission.complete_date)
        : null,
      status: mission.status,
    })),
  };
};

export interface CompleteMissionChallengeData {
  user_id: number;
  mission_id: number;
}

export const paramsToCompleteMissionChallenge = (
  userIdParam: string,
  missionIdParam: string
): CompleteMissionChallengeData => {
  return {
    user_id: Number(userIdParam),
    mission_id: Number(missionIdParam),
  };
};