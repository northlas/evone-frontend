import { Wallet } from "./wallet"

export interface User {
    id: number,
    email: string,
    name: string,
    slugName: string,
    password: string,
    wallet: Wallet,
    accountNo: string
}
