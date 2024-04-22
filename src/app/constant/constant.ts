import { environment } from "src/environments/environment.development";

export class Constant {
  static readonly PUBLIC_POST_URL = [`${environment.apiUrl}/api/auth/login`, `${environment.apiUrl}/api/vendors`, `${environment.apiUrl}/api/customers`];
}
