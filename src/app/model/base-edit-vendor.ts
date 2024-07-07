import { SafeResourceUrl } from "@angular/platform-browser";
import { Vendor } from "./vendor";

export interface BaseEditVendor{
    existing: Vendor,
    profile: SafeResourceUrl
}