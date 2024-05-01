import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { JobTransaction } from '../model/job-transaction';
import { Observable } from 'rxjs';
import { JobTransactionParam } from '../model/job-transaction-param';
import { BasePageResponse } from '../model/base-page-response';

@Injectable({
  providedIn: 'root'
})
export class JobTransactionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getTransactionByUser(param: JobTransactionParam): Observable<BasePageResponse<JobTransaction>> {
    return this.http.get<BasePageResponse<JobTransaction>>(`${this.host}/api/job-transactions`, {params: new HttpParams({fromObject: param})})
  }

  public postTransaction(vendorName: string, slugTitle: string, jobTransaction: JobTransaction): Observable<JobTransaction> {
    return this.http.post<JobTransaction>(`${this.host}/api/vendors/${vendorName}/job-offers/${slugTitle}/transactions`, jobTransaction);
  }

  public putTransaction(param: JobTransactionParam): Observable<JobTransaction> {
    return this.http.put<JobTransaction>(`${this.host}/api/job-transactions`, param);
  }
}
