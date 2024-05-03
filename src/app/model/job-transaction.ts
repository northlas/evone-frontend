import { JobTransactionStatus } from "../enum/job-transaction-status"
import { Customer } from "./customer"
import { Occasion } from "./occasion"
import { JobOffer } from "./job-offer"

export interface JobTransaction {
    id: string,
    reference: string,
    status: JobTransactionStatus,
    createdDt: Date,
    updatedDt: Date,
    freelancer: Customer,
    jobOffer: JobOffer,
    paymentAmount: number
}
