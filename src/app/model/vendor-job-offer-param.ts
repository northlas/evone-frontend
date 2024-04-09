export interface VendorJobOfferParam {
    [key: string]: string | string[] | number,
    talent: string,
    title: string,
    occasions: string[],
    location: string,
    minPrice: number,
    maxPrice: number,
    sort: string
}
