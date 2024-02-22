import { User } from "./user";

export interface Vendor extends User{
    address: string, 
    phone: string, 
    description: string,
    minPrice: number
}