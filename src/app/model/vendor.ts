import { City } from "./city";
import { Province } from "./province";
import { User } from "./user";

export interface Vendor extends User{
    city: City,
    province: Province
    address: string, 
    phone: string, 
    description: string,
    minPrice: number,
    maxPrice: number
}