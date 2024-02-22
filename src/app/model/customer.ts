import { User } from "./user";

export interface Customer extends User {
    isFreelancer: boolean
}