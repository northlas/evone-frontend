export interface VendorServiceOfferParam {
    [key: string]: string | string[] | number,
    category: string,
    name: string,
    occasions: string[],
    location: string,
    minPrice: number,
    maxPrice: number,
    sort: string
}