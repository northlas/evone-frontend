import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BasePageResponse } from '../model/base-page-response';
import { VendorJobOfferParam } from '../model/vendor-job-offer-param';
import { Vendor } from '../model/vendor';
import { BaseResponse } from '../model/base-response';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllJob(param: VendorJobOfferParam, page: number): Observable<BasePageResponse> {
    const params = new HttpParams({fromObject: param}).append('page', page);
    var output = this.http.get<BasePageResponse>(`${this.host}/api/job-offers`, {params: params});
    this.http.get<BasePageResponse>(`${this.host}/api/job-offers`, {params: params}).subscribe(data => {
    });
    return this.http.get<BasePageResponse>(`${this.host}/api/job-offers`, {params: params})
  }

}
