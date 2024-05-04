import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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

  public getProfile(): Observable<Customer> {
    return this.http.get<Customer>(`${this.host}/api/customers/profile`);
  }

  public addCustomer(customer: Customer, profile: File | null): Observable<HttpResponse<BaseResponse>> {
    const formData = new FormData();
    formData.set('model', new Blob([JSON.stringify(customer)], {type: 'application/json'}))
    if (customer.isFreelancer) {
      formData.set('profile', profile!);
    }
    return this.http.post<BaseResponse>(`${this.host}/api/customers`, formData, {observe: 'response'})
  }
}
