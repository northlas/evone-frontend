import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BasePageResponse } from '../model/base-page-response';
import { VendorServiceOfferParam } from '../model/vendor-service-offer-param';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllVendor(param: VendorServiceOfferParam, page: number): Observable<BasePageResponse> {
    const params = new HttpParams({fromObject: param}).append('page', page);
    return this.http.get<BasePageResponse>(`${this.host}/api/vendors`, {params: params})
  }
}
