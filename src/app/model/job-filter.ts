import { JobTransactionParam } from "./job-transaction-param";
import { VendorJobOfferParam } from "./vendor-job-offer-param";

export interface JobFilter {
    type: string,
    isVendor: boolean,
    jobParam: VendorJobOfferParam,
    jobTransactionParam: JobTransactionParam
}
