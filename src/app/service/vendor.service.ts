import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasePageResponse } from '../model/base-page-response';
import { BaseResponse } from '../model/base-response';
import { Vendor } from '../model/vendor';
import { VendorServiceOfferParam } from '../model/vendor-service-offer-param';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllVendor(param: VendorServiceOfferParam, page: number): Observable<BasePageResponse<Vendor>> {
    const params = new HttpParams({fromObject: param}).append('page', page);
    return this.http.get<BasePageResponse<Vendor>>(`${this.host}/api/vendors`, {params: params})
  }

  public getVendorDetail(slugName: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.host}/api/vendors/${slugName}`)
  }

  public getProfile(): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.host}/api/vendors/profile`);
  }

  public addVendor(model: Vendor, profile: File): Observable<BaseResponse> {
    const formData = new FormData();
    formData.set('model', new Blob([JSON.stringify(model)], {type: 'application/json'}))
    formData.set('profile', profile);

    return this.http.post<BaseResponse>(`${this.host}/api/vendors`, formData);
  }

  public editVendor(model: Vendor, profile: File | null): Observable<BaseResponse> {
    const formData = new FormData();
    formData.set('model', new Blob([JSON.stringify(model)], {type: 'application/json'}))
    if (profile) formData.set('profile', profile);

    return this.http.put<BaseResponse>(`${this.host}/api/vendors`, formData);
  }
}
