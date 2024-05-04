import { Talent } from "./talent";
import { User } from "./user";

export interface Customer extends User {
    isFreelancer: boolean,
    phone: string,
    gender: number,
    description: string,
    talents: Talent[]
}
