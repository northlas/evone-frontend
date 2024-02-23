import { Province } from "./province";

export interface City {
    id: number,
    name: string,
    province: Province
}