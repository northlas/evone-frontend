export interface BaseResponse {
    timestamp: Date,
    httpStatusCode: number,
    httpStatus: string,
    reason: string,
    message: string
}