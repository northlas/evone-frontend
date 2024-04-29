import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BasePageResponse } from '../model/base-page-response';
import { ServiceOffer } from '../model/service-offer';
import { VendorServiceOfferParam } from '../model/vendor-service-offer-param';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfferService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllServiceOffer(vendorSlugName: string, param: VendorServiceOfferParam | undefined, page: number): Observable<BasePageResponse<ServiceOffer>> {
    const params = new HttpParams({fromObject: param}).append('vendor', vendorSlugName).append('page', page);
    return this.http.get<BasePageResponse<ServiceOffer>>(`${this.host}/api/service-offers`, {params: params})
  }

  public getServiceOfferDetail(vendorSlugName: string, serviceSlugTitle: string): Observable<ServiceOffer> {
    return this.http.get<ServiceOffer>(`${this.host}/api/vendors/${vendorSlugName}/service-offers/${serviceSlugTitle}`);
  }

  public addServiceOffer(model: ServiceOffer, pictures: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('model', new Blob([JSON.stringify(model)], {type: 'application/json'}))
    pictures.forEach((value) => {
      formData.append('pictures', value);
    })

    return this.http.post<any>(`${this.host}/api/service-offers`, formData);
  }

  public editServiceOffer(model: ServiceOffer, pictures: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('model', new Blob([JSON.stringify(model)], {type: 'application/json'}))
    pictures.forEach((value) => {
      formData.append('pictures', value);
    })

    return this.http.put<any>(`${this.host}/api/service-offers`, formData);
  }

  public getId(): Observable<any> {
    return this.http.get<any>(`${this.host}/api/auth/id`);
  }

  public assignQueryParams(params: Params) {
    let param = params as VendorServiceOfferParam;
    if (!Array.isArray(params['category'])) {
      param.category = [params['category']]
    }
    if (!Array.isArray(params['occasions'])) {
      param.occasions = [params['occasions']]
    }
    return param;
  }
}
