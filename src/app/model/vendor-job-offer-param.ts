import { Params } from "@angular/router"

export interface VendorJobOfferParam {
    [key: string]: string | string[] | number,
    talent: string,
    title: string,
    occasions: string[],
    location: string,
    minPrice: number,
    maxPrice: number,
    sort: string,
    vendor: string
}

export const assignQueryParams = (params: Params | undefined): VendorJobOfferParam => {
    if (!params) {
        return {} as VendorJobOfferParam;
    }

    let {...param} = params as VendorJobOfferParam
    if (param.occasions && !Array.isArray(param.occasions)) {
        param.occasions = [param.occasions]
    }
    return param;
}
