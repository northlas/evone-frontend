import { Category } from "./category";
import { Occasion } from "./occasion";
import { ServiceOfferPicture } from "./service-offer-picture";
import { Vendor } from "./vendor";

export interface ServiceOffer {
  categoryId: number,
  title: string,
  slugTitle: string,
  description: string,
  price: number,
  minimumQty: number,
  isActive: boolean,
  createdDt: Date,
  updatedDt: Date,
  vendor: Vendor,
  category: Category,
  occasions: Occasion[],
  pictures: ServiceOfferPicture[],
}
