import { Params } from "@angular/router"

export interface VendorServiceOfferParam {
    [key: string]: string | string[] | number | boolean,
    category: string[],
    vendor: string,
    title: string,
    occasions: string[],
    location: string,
    minPrice: number,
    maxPrice: number,
    sort: string,
    active: boolean
}

export const assignQueryParams = (params: Params | undefined): VendorServiceOfferParam => {
    if (!params) {
        return {} as VendorServiceOfferParam;
    }

    let {...param} = params as VendorServiceOfferParam
    if (param.category && !Array.isArray(param.category)) {
        param.category = [param.category]
    }
    if (param.occasions && !Array.isArray(param.occasions)) {
        param.occasions = [param.occasions]
    }
    return param;
}