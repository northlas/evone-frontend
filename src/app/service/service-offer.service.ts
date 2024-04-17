import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BasePageResponse } from '../model/base-page-response';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfferService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllServiceOfferByVendor(vendorSlugName: string): Observable<any> {
    return this.http.get<any>(`${this.host}/api/vendors/${vendorSlugName}/service-offers`)
  }

  public getServiceOfferDetail(serviceSlugTitle: string): Observable<any> {
    return this.http.get<any>(`${this.host}/api/service-offers/${serviceSlugTitle}`);
  }
}
