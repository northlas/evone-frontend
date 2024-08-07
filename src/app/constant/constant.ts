import { environment } from "src/environments/environment";

export class Constant {
  static readonly PUBLIC_POST_URL = [`${environment.apiUrl}/api/auth/login`, `${environment.apiUrl}/api/vendors`, `${environment.apiUrl}/api/customers`];
  static readonly PUBLIC_GET_URL = [`${environment.apiUrl}/api/categories`,`${environment.apiUrl}/api/vendors`, `${environment.apiUrl}/api/customers`, `${environment.apiUrl}/api/vendors/**`, `${environment.apiUrl}/api/vendors/**/service-offers/**`,
  `${environment.apiUrl}/api/talents`,`${environment.apiUrl}/api/job-offers`, `${environment.apiUrl}/api/job-offers/**`];
}
