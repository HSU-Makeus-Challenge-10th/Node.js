export interface UserSignUpRequset {
    login_id : String,
    password : String,
    birth : String,
    gender : String,
    address : String,
    email : String,
    phone_number : String,
    preference : number
};

export const BodyToUser = (body: UserSignUpRequset) => {
    return {
        login_id: body.login_id,
        password: body.password,
        birth: body.birth,
        gender: body.gender,
        address: body.address || "",
        email: body.email,
        phone_number: body.phone_number,
        preference: body.preference
    };
};

export const ResponseFromUser = (data:any) => {
    const reg_date = new Date(data.reg_date)
    return {
        id : data.id,
        login_id : data.login_id,
        reg_date,
        status : data.status,
        point : data.point,
        email : data.email,
        phone_number : data.phone_number,
        phone_verified : data.phone_verified,
    }
}