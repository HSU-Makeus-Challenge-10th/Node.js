import dotenv from "dotenv";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { prisma } from "./db.config.js";
import { use } from "passport";
import bcrypt from "bcrypt"

dotenv.config();


type AuthUser = {
  id: bigint;
  email: string;
  loginId: string;
};

type JwtPayload = {
  id?: string;
  email?: string;
  loginId?: string;
};

type GoogleAuthResult = {
    user : {
        id: bigint;
        email: string;
        loginId: string;
        gender: string;
        birth: string;
        address: string | null;
        phoneNumber: string;
    };
    isNewUser: boolean;
    requiresProfileSetup: boolean;
}

const isProfileComplated = (user: {
    gender: string;
    birth: string;
    address: string | null;
    phoneNumber: string;
}) => {
    return (
        user.gender !== "N" &&
        user.birth !== "19700101" &&
        !!user.address &&
        !user.phoneNumber.startsWith("G")
    );
}

export const generateAccessToken = (user: AuthUser) => {
    return jwt.sign (
        {id: user.id.toString(), email: user.email, loginId: user.loginId},
        process.env.JWT_SECRET!,
        {expiresIn: "1h"}
    );
};

export const generateRefreshToken = (user: Pick<AuthUser, "id">,) => {
    return jwt.sign(
        {id: user.id.toString()},
        process.env.JWT_SECRET!,
        {expiresIn: "14d"}
    );
};

const googleVerify = async (profile: Profile): Promise<GoogleAuthResult> => {
    const email = profile.emails?.[0]?.value;

    if(!email) {
        throw new Error("Google 프로필에 이메일이 없습니다.");
    }

    let user = await prisma.member.findFirst({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            loginId: true,
            gender: true,
            birth: true,
            address: true,
            phoneNumber: true,
        },
    });

    let isNewUser = false;

    if (!user) {
        isNewUser = true;

        user = await prisma.member.create({
            data: {
                email,
                loginId: `Google_${profile.id}`.slice(0,20),
                password: await bcrypt.hash(`Google:${profile.id}:${email}`, 10),
                gender: "N",
                birth: "19700101",
                address: "",
                phoneNumber: `Google_${profile.id}`.slice(0, 12)
            },
            select: {
                id: true,
                email: true,
                loginId: true,
                gender: true,
                birth: true,
                address: true,
                phoneNumber: true,
            },
        });
    }

    return {
        user,
        isNewUser,
        requiresProfileSetup: isNewUser || !isProfileComplated(user)
    };
}


export const googleStrategy = new GoogleStrategy({
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
    },
    async (_accessToken, _refreshToken, profile, cb) => {
        try {
            const {user, isNewUser, requiresProfileSetup} = await googleVerify(profile);

            const tokens = {
                accessToken: generateAccessToken(user),
                refreshToken: generateRefreshToken(user),
                isNewUser,
                requiresProfileSetup,
                redirectTo: requiresProfileSetup ? "/users/profile/setup" : "/mypage",
            };

            return cb(null, tokens);
        } catch(err) {
            return cb(err as Error);
        }
    }
);

export const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload: JwtPayload, done) => {
        try {
            if(!payload.id) {
                return done(null, false)
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

            if(!user || user.status !== "A") {
                return done(null, false);
            }

            return done(null, {
                id: user.id.toString(),
                email: user.email,
                loginId: user.loginId,
            });
        } catch(err) {
            return done(err, false);
        }
    }
);