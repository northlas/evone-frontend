import { User } from "./user";

export interface Customer extends User {
    new(isFreelancer: boolean): User
}