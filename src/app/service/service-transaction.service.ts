import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasePageResponse } from '../model/base-page-response';
import { BaseResponse } from '../model/base-response';
import { ServiceTransaction } from '../model/service-transaction';
import { ServiceTransactionParam } from '../model/service-transaction-param ';

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

  public putTransaction(param: ServiceTransactionParam): Observable<ServiceTransaction> {
    return this.http.put<ServiceTransaction>(`${this.host}/api/service-transactions`, param);
  }

  public putReview(param: ServiceTransactionParam): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.host}/api/service-transactions/${param.id}/reviews`, param);
  }
}
