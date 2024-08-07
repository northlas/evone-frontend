import { ServiceTransactionParam } from "./service-transaction-param ";
import { VendorServiceOfferParam } from "./vendor-service-offer-param";

export interface Filter {
    type: string,
    isVendor: boolean,
    serviceParam: VendorServiceOfferParam,
    serviceTransactionParam: ServiceTransactionParam
}
