export interface BasePageResponse<T> {
    items: T[],
    totalItems: number,
    totalPage: number,
    pageSize: number,
    currentPage: number
}
