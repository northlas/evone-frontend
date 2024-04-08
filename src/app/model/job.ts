import { Category } from "./category";
import { City } from "./city";
import { Province } from "./province";
import { Vendor } from "./vendor";
import { Occasion } from "./occasion";

export interface Job{
    id: number,
    vendor: Vendor
    title: string,
    slugTitle: string,
    description: string,
    minPrice: number,
    maxPrice: number,
    talent: Category,
    occasion: Occasion
}
