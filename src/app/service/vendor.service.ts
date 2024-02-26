import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Vendor } from '../model/vendor';
import { BasePageResponse } from '../model/base-page-response';
import { CategorySearchParam } from '../model/category-search-param';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllVendor(param: CategorySearchParam, page: number): Observable<BasePageResponse> {
    const params = new HttpParams({fromObject: param}).append('page', page);
    return this.http.get<BasePageResponse>(`${this.host}/api/vendors`, {params: params})
  }
}
