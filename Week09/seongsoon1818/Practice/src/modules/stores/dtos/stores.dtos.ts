export interface CreateStoreReviewRequest {
    user_id: number
    content: string
    star: number
}

export interface CreateStoreReviewData {
    store_id: number
    user_id: number
    content: string
    star: number
}

export interface StoreReviewResponse {
    id: string
    store_id: string
    store_name: string
    user_id: string
    user_login_id: string
    content: string
    star: number
    reg_date: Date
    edit_date: Date | null
    status: string
}

export const bodyToCreateStoreReview = (
    storeIdParam: string,
    userId: string,
    body: CreateStoreReviewRequest
): CreateStoreReviewData => {
    return {
        store_id: Number(storeIdParam),
        user_id: Number(userId),
        content: (body.content ?? "").trim(),
        star: Number(body.star)
    };
}

export const responseFromStoreReview = (review: any): StoreReviewResponse => {
    return {
        id: review.id.toString(),
        store_id: review.store_id.toString(),
        store_name: review.store_name,
        user_id: review.user_id.toString(),
        user_login_id: review.user_login_id,
        content: review.content,
        star: review.star,
        reg_date: review.reg_date,
        edit_date: review.edit_date,
        status: review.status
    };
}