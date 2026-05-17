export interface UserSignUpRequest {
    login_id : string,
    password : string,
    birth : string,
    gender : string,
    address? : string,
    email : string,
    phone_number : string,
    preferenceIds : number[]
};

export interface UserResponse {
    id: string,
    login_id: string,
    birth: string,
    gender: string,
    address: string,
    email: string,
    phone_number: string,
    reg_date: Date,
    status: string,
    point: number,
    phone_verified: string,
    preferences: {
        id: number,
        name: string
    }[]
};

export const bodyToUserSignUp = (body: UserSignUpRequest) => {
    return {
        login_id: body.login_id,
        password: body.password,
        birth: body.birth,
        gender: body.gender,
        address: body.address ?? "",
        email: body.email,
        phone_number: body.phone_number,
        preferenceIds: body.preferenceIds ?? []
    };
};

export const responseFromUser = (user:any, preferences:any[]): UserResponse => ({
    id: user.id.toString() ,
    login_id: user.loginId,
     birth: user.birth,
    gender: user.gender,
    address: user.address ?? "",
    email: user.email,
    phone_number: user.phoneNumber,
    reg_date: user.regDate,
    status: user.status,
    point: user.point,
    phone_verified: user.phoneVerified,
    preferences: preferences.map((p) => ({
        id: p.category_id,
        name: p.name,
    })),
});