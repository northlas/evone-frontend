import { BaseRating } from "./base-rating";
import { BaseReview } from "./base-review";
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
  rating: BaseRating,
  vendor: Vendor,
  category: Category,
  reviews: BaseReview[],
  occasions: Occasion[],
  pictures: ServiceOfferPicture[],
}
