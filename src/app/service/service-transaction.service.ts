import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ServiceTransaction } from '../model/service-transaction';
import { Observable } from 'rxjs';
import { ServiceTransactionParam } from '../model/service-transaction-param ';
import { BasePageResponse } from '../model/base-page-response';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransactionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getTransactionByUser(param: ServiceTransactionParam): Observable<BasePageResponse<ServiceTransaction>> {
    return this.http.get<BasePageResponse<ServiceTransaction>>(`${this.host}/api/service-transactions`, {params: new HttpParams({fromObject: param})})
  }

  public postTransaction(vendorName: string, slugTitle: string, serviceTransaction: ServiceTransaction): Observable<ServiceTransaction> {
    return this.http.post<ServiceTransaction>(`${this.host}/api/vendors/${vendorName}/service-offers/${slugTitle}/transactions`, serviceTransaction);
  }
}
