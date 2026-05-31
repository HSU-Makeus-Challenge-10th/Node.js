import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { prisma } from "../../db.config.js";
import { Prisma } from "../../../generated/prisma/client.js";

type PrismaExecutor = typeof prisma | Prisma.TransactionClient


export const addMission = async (data: {
  store_id: number | bigint | string;
  title: string;
  description: string;
  point: number;
  expired_date: Date;
}): Promise<bigint> => {
  const mission = await prisma.mission.create({
    data: {
      title: data.title,
      storeId: BigInt(data.store_id),
      description: data.description,
      point: data.point,
      expiredDate: data.expired_date,

      // regDate, status는 schema.prisma의 기본값으로 처리 가능
      // regDate: @default(now())
      // status: @default("A")
    },
    select: {
      id: true,
    },
  });

  return mission.id;
};

export const getMissionById = async (
  missionId: number | bigint | string
) => {
  const mission = await prisma.mission.findUnique({
    where: {
      id: BigInt(missionId),
    },
    select: {
      id: true,
      storeId: true,
      title: true,
      description: true,
      point: true,
      regDate: true,
      expiredDate: true,
      status: true,
      store: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!mission) return null;

  return {
    id: mission.id,
    store_id: mission.storeId,
    store_name: mission.store.name,
    title: mission.title,
    description: mission.description,
    point: mission.point,
    reg_date: mission.regDate,
    expired_date: mission.expiredDate,
    status: mission.status,
  };
};

export const findUserMissionByUserIdAndMissionId = async (
  userId: number | bigint | string,
  missionId: number | bigint | string
) => {
  const userMission = await prisma.userMission.findFirst({
    where: {
      userId: BigInt(userId),
      missionId: BigInt(missionId),
    },
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      userId: true,
      missionId: true,
      expiredDate: true,
      completeDate: true,
      status: true,
    },
  });

  if (!userMission) return null;

  return {
    id: userMission.id,
    user_id: userMission.userId,
    mission_id: userMission.missionId,
    expired_date: userMission.expiredDate,
    complete_date: userMission.completeDate,
    status: userMission.status,
  };
};

export const insertUserMission = async (data: {
  user_id: number | bigint | string;
  mission_id: number | bigint | string;
  expired_date: Date;
}): Promise<bigint> => {
  const userMission = await prisma.userMission.create({
    data: {
      missionId: BigInt(data.mission_id),
      userId: BigInt(data.user_id),
      expiredDate: data.expired_date,

      // completeDate는 nullable이라 생략 가능
      // status는 @default("G")라 생략 가능
    },
    select: {
      id: true,
    },
  });

  return userMission.id;
};

export const getUserMissionById = async (
  userMissionId: number | bigint | string
) => {
  const userMission = await prisma.userMission.findUnique({
    where: {
      id: BigInt(userMissionId),
    },
    select: {
      id: true,
      missionId: true,
      userId: true,
      expiredDate: true,
      completeDate: true,
      status: true,
      mission: {
        select: {
          title: true,
          storeId: true,
          store: {
            select: {
              name: true,
            },
          },
        },
      },
      member: {
        select: {
          loginId: true,
        },
      },
    },
  });

  if (!userMission) return null;

  return {
    id: userMission.id,
    mission_id: userMission.missionId,
    mission_title: userMission.mission.title,
    store_id: userMission.mission.storeId,
    store_name: userMission.mission.store.name,
    user_id: userMission.userId,
    user_login_id: userMission.member.loginId,
    expired_date: userMission.expiredDate,
    complete_date: userMission.completeDate,
    status: userMission.status,
  };
};

export const getMissionsByStoreId = async(data: {
  storeId : number | bigint | string;
  page : number;
  limit : number;
}) => {
  const storeId = BigInt(data.storeId)
  const skip = (data.page - 1) * data.limit;
  const take = data.limit;

  const [total, missions] = await prisma.$transaction([
    prisma.mission.count({
      where: {
        storeId,
        status: "A",
        expiredDate: {
          gt: new Date(),
        },
      },
    }),

    prisma.mission.findMany({
      where: {
        storeId,
        status: "A",
        expiredDate: {
          gt: new Date(),
        },
      },
      orderBy: [{
        expiredDate: "asc",
      },{
        id: "desc"
      }],
      skip,
      take,
      select: {
        id : true,
        storeId : true,
        title: true,
        description: true,
        point: true,
        regDate: true,
        expiredDate: true,
        status: true,
      },
    }),
  ]);

  return {
    total,
    missions: missions.map((mission) => ({
      id: mission.id,
      store_id: mission.storeId,
      title: mission.title,
      description: mission.description,
      point: mission.point,
      reg_date: mission.regDate,
      expired_date: mission.expiredDate,
      status: mission.status,
    })),
  };
}

export const getOngoingMissionsByUserId = async (data: {
  userId: number | bigint | string;
  page: number;
  limit: number;
}) => {
  const userId = BigInt(data.userId);
  const skip = (data.page - 1) * data.limit;
  const take = data.limit;

  const [total, userMissions] = await prisma.$transaction([
    prisma.userMission.count({
      where: {
        userId,
        status: "G",
      },
    }),

    prisma.userMission.findMany({
      where: {
        userId,
        status: "G",
      },
      orderBy: [
        {
          expiredDate: "asc",
        },
        {
          id: "desc",
        },
      ],
      skip,
      take,
      select: {
        id: true,
        userId: true,
        missionId: true,
        expiredDate: true,
        completeDate: true,
        status: true,
        mission: {
          select: {
            title: true,
            description: true,
            point: true,
            storeId: true,
            store: {
              select: {
                name: true,
                address: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    total,
    userMissions: userMissions.map((userMission) => ({
      id: userMission.id,
      user_id: userMission.userId,
      mission_id: userMission.missionId,
      mission_title: userMission.mission.title,
      mission_description: userMission.mission.description,
      point: userMission.mission.point,
      store_id: userMission.mission.storeId,
      store_name: userMission.mission.store.name,
      store_address: userMission.mission.store.address,
      expired_date: userMission.expiredDate,
      complete_date: userMission.completeDate,
      status: userMission.status,
    })),
  };
};

export const completeUserMission = async (
  userMissionId: number | bigint | string
): Promise<bigint> => {
  const userMission = await prisma.userMission.update({
    where: {
      id: BigInt(userMissionId),
    },
    data: {
      status: "C",
      completeDate: new Date(),
    },
    select: {
      id: true,
    },
  });

  return userMission.id;
};