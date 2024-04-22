import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BasePageResponse } from '../model/base-page-response';
import { ServiceOffer } from '../model/service-offer';
import { VendorServiceOfferParam } from '../model/vendor-service-offer-param';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfferService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllServiceOfferByVendor(vendorSlugName: string, param: VendorServiceOfferParam | undefined): Observable<any> {
    return this.http.get<any>(`${this.host}/api/vendors/${vendorSlugName}/service-offers`, {params: param})
  }

  public getServiceOfferDetail(serviceSlugTitle: string): Observable<any> {
    return this.http.get<any>(`${this.host}/api/service-offers/${serviceSlugTitle}`);
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
}
