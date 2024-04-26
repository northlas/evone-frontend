import { Customer } from "./customer"
import { Occasion } from "./occasion"
import { ServiceOffer } from "./service-offer"

export interface ServiceTransaction {
    id: string,
    occasionId: number,
    reference: string,
    status: number,
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
