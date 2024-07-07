export interface JobTransactionParam {
    [key: string]: string | number,
    id: string,
    talent: string,
    title: string,
    status: number,
    rating: number,
    review: string,
    page: number,
    startDt: string,
    endDt: string
}
