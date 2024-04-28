import { ServiecTransactionStatus } from "../enum/header-type.enum copy"
import { Customer } from "./customer"
import { Occasion } from "./occasion"
import { ServiceOffer } from "./service-offer"

export interface ServiceTransaction {
    id: string,
    occasionId: number,
    reference: string,
    status: ServiecTransactionStatus,
    qty: number
    paymentAmount: number,
    address: string,
    createdDt: Date,
    updatedDt: Date,
    startDt: Date,
    endDt: Date,
    customer: Customer,
    serviceOffer: ServiceOffer,
    occasion: Occasion
}
