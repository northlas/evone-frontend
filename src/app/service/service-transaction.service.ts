import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ServiceTransaction } from '../model/service-transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransactionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public postTransaction(vendorName: string, slugTitle: string, serviceTransaction: ServiceTransaction): Observable<ServiceTransaction> {
    return this.http.post<ServiceTransaction>(`${this.host}/api/vendors/${vendorName}/service-offers/${slugTitle}/transactions`, serviceTransaction);
  }
}
