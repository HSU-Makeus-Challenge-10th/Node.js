import { UserSignUpRequset } from "../dtos/user.dtos.js";
import { ResponseFromUser } from "../dtos/user.dtos.js";

import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
} from "../repositories/user.repositories.js";

export const userSignUp = async (data: UserSignUpRequset) => {
    const joinUserId = await addUser({
        login_id : data.login_id,
        password: data.password,
        birth: data.birth,
        gender: data.gender,
        address: data.address,
        email: data.email,
        phone_number: data.phone_number,
        preference: data.preference
    });

    if (joinUserId === null) {
        throw new Error("이미 존재하는 사용자입니다.");
    }

    const preference = data.preference;
    await setPreference(joinUserId, preference);

    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return ResponseFromUser({user, preference});
};

