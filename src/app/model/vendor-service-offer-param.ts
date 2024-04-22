export interface VendorServiceOfferParam {
    [key: string]: string | string[] | number | boolean,
    category: string,
    name: string,
    occasions: string[],
    location: string,
    minPrice: number,
    maxPrice: number,
    sort: string,
    status: boolean
}
