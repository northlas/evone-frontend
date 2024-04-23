import { User } from "./user";

export interface Customer extends User {
    phone: string,
    isFreelancer: boolean
}
