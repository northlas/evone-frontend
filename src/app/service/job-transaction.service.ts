import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasePageResponse } from '../model/base-page-response';
import { JobTransaction } from '../model/job-transaction';
import { JobTransactionParam } from '../model/job-transaction-param';

@Injectable({
  providedIn: 'root'
})
export class JobTransactionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getTransactionByUser(param: JobTransactionParam): Observable<BasePageResponse<JobTransaction>> {
    return this.http.get<BasePageResponse<JobTransaction>>(`${this.host}/api/job-transactions`, {params: new HttpParams({fromObject: param})})
  }

  public postTransaction(vendorName: string, slugTitle: string, startDt: string, endDt: string): Observable<JobTransaction> {
    return this.http.post<JobTransaction>(`${this.host}/api/vendors/${vendorName}/job-offers/${slugTitle}/${startDt}/${endDt}/transactions`, null);
  }

  public putTransaction(param: JobTransactionParam): Observable<JobTransaction> {
    return this.http.put<JobTransaction>(`${this.host}/api/job-transactions`, param);
  }
}
