import { Customer } from "./customer";

export interface Freelancer extends Customer {
    phone: string,
    gender: number,
    description: string
}