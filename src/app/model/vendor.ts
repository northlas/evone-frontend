import { Category } from "./category";
import { City } from "./city";
import { Province } from "./province";
import { User } from "./user";
import { VendorSocialMedia } from "./vendor-social-media";

export interface Vendor extends User{
    address: string, 
    phone: string, 
    description: string,
    accountNo: string,
    profile: string,
    minPrice: number,
    maxPrice: number,
    city: City,
    province: Province,
    categories: Category[],
    socialMedia: VendorSocialMedia[]
}