import { Category } from "./category";
import { City } from "./city";
import { Province } from "./province";
import { Vendor } from "./vendor";
import { Occasion } from "./occasion";
import { JobPicture } from "./job-picture";


export interface Job{
    id: number,
    vendor: Vendor
    title: string,
    slugTitle: string,
    description: string,
    price: number,
    minPrice: number,
    maxPrice: number,
    talent: Category,
    occasion: Occasion,
    pictures: JobPicture[],
    createdDt: Date
}
