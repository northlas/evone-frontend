import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ServiceOfferWishlist } from '../model/service-offer-wishlist';
import { Observable } from 'rxjs';
import { BaseResponse } from '../model/base-response';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfferWishlistService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getWishlist(vendorName: string, slugTitle: string): Observable<ServiceOfferWishlist> {
    return this.http.get<ServiceOfferWishlist>(`${this.host}/api/vendors/${vendorName}/service-offers/${slugTitle}/wishlist`, undefined);
  }

  public addWishlist(vendorName: string, slugTitle: string): Observable<ServiceOfferWishlist> {
    return this.http.post<ServiceOfferWishlist>(`${this.host}/api/vendors/${vendorName}/service-offers/${slugTitle}/wishlist`, undefined);
  }

  public deleteWishlist(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.host}/api/service-wishlists/${id}`);
  }
}
