import { JobTransaction } from "./job-transaction";
import { ServiceTransaction } from "./service-transaction";

export interface ReviewRequest {
    isService: boolean,
    transaction: ServiceTransaction | JobTransaction
}