import type { Request } from "express";
import jwt from "jsonwebtoken"
import { prisma } from "./db.config.js";

type JwtPayload = {
    id?: string;
    email?: string;
    loginId?: string;
};

export async function expressAuthentication(
    request: Request,
    securityName: string,
    _scope?: string[]
): Promise<unknown> {
    if (securityName !== "jwt") {
        throw new Error("지원하지 않는 인증 방식입니다.");
    }

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error("인증 토큰이 없습니다.");
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as JwtPayload;

    if (!payload.id) {
        throw new Error("토큰 정보가 올바르지 않습니다.");
    }

    const user = await prisma.member.findUnique({
        where: {
            id: BigInt(payload.id),
        },
        select: {
            id: true,
            email: true,
            loginId: true,
            status: true,
        },
    });

    if (!user || user.status !== "A") {
        throw new Error("인증된 사용자가 아닙니다.");
    }

    const loginUser = {
        id: user.id.toString(),
        email: user.email,
        loginId: user.loginId,
    };

    (request as any).user = loginUser;

    return loginUser;
}