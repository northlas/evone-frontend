import { Occasion } from "./occasion"
import { ServiceOffer } from "./service-offer"

export interface ServiceTransaction {
    occasionId: number,
    reference: string,
    status: number,
    qty: number
    paymentAmount: number,
    snapToken: string,
    createdDt: Date,
    updatedDt: Date,
    startDt: Date,
    endDt: Date,
    serviceOffer: ServiceOffer,
    occasion: Occasion
}
