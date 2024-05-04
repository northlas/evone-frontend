import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class FreelancerService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getProfile(): Observable<Customer> {
    return this.http.get<Customer>(`${this.host}/api/freelancers/profile`);
  }
}
