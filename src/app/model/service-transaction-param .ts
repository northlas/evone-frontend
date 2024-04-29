export interface ServiceTransactionParam {
    [key: string]: string | number,
    id: string,
    category: string,
    title: string,
    status: number,
    startDt: string,
    endDt: string,
    page: number
}
