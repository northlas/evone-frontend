import { City } from "./city";
import { Province } from "./province";
import { User } from "./user";

export interface Vendor extends User{
    address: string, 
    phone: string, 
    description: string,
    minPrice: number,
    city: City,
    province: Province
}