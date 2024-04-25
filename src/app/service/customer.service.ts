import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Customer } from '../model/customer';
import { Observable } from 'rxjs';
import { BaseResponse } from '../model/base-response';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getCustomer(email: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.host}/api/customers/${email}`);
  }

  public addCustomer(customer: Customer): Observable<HttpResponse<BaseResponse>> {
    return this.http.post<BaseResponse>(`${this.host}/api/customers`, customer, {observe: 'response'})
  }
}
