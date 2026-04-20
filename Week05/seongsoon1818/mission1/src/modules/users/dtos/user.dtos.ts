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
    id: number,
    login_id: string,
    birth: string,
    gender: string,
    address: string,
    email: string,
    phone_number: string,
    reg_date: Date,
    status: string
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
        address: body.address || "",
        email: body.email,
        phone_number: body.phone_number,
        preferenceIds: body.preferenceIds ?? []
    };
};

export const responseFromUser = (user:any, preferences:any[]): UserResponse => ({
    id: user.id,
    login_id: user.login_id,
     birth: user.birth,
    gender: user.gender,
    address: user.address,
    email: user.email,
    phone_number: user.phone_number,
    reg_date: user.reg_date,
    status: user.status,
    point: user.point,
    phone_verified: user.phone_verified,
    preferences: preferences.map((p) => ({
    id: p.category_id,
    name: p.name,
  })),
});