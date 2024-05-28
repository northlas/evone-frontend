import { SafeResourceUrl } from "@angular/platform-browser";
import { Customer } from "./customer";

export interface BaseEditCustomer{
    existing: Customer,
    profile: SafeResourceUrl
}