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
    id: number
    store_id: number
    store_name: string
    user_id: number
    user_login_id: string
    content: string
    star: number
    reg_date: Date
    edit_date: Date | null
    status: string
}

export const bodyToCreateStoreReview = (
    storeIdParam: string,
    body: CreateStoreReviewRequest
): CreateStoreReviewData => {
    return {
        store_id: Number(storeIdParam),
        user_id: Number(body.user_id),
        content: (body.content ?? "").trim(),
        star: Number(body.star)
    };
}

export const responseFromStoreReview = (review: any) => {
    return {
        id: review.id,
        store_id: review.store_id,
        store_name: review.store_name,
        user_id: review.user_id,
        user_login_id: review.user_login_id,
        content: review.content,
        star: review.star,
        reg_date: review.reg_date,
        edit_date: review.edit_date,
        status: review.status
    };
}