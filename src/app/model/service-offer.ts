import { Category } from "./category";
import { Occasion } from "./occasion";
import { ServiceOfferPicture } from "./service-offer-picture";

export interface ServiceOffer {
  title: string,
  slugTitle: string,
  description: string,
  price: number,
  isActive: boolean,
  createdDt: Date,
  updatedDt: Date,
  category: Category,
  occasions: Occasion[],
  pictures: ServiceOfferPicture[],
}
