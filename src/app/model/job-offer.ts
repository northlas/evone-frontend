import { Category } from "./category";
import { City } from "./city";
import { Province } from "./province";
import { Vendor } from "./vendor";
import { Occasion } from "./occasion";
import { JobPicture } from "./job-picture";


export interface JobOffer{
    id: number,
    vendor: Vendor
    title: string,
    slugTitle: string,
    description: string,
    price: number,
    minPrice: number,
    maxPrice: number,
    talent: Category,
    talentId: number,
    occasion: Occasion,
    occasionId: number,
    pictures: JobPicture[],
    createdDt: Date
    isActive: boolean,
}
