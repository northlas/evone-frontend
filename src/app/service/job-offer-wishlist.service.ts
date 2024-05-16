import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../model/base-response';
import { JobOfferWishlist } from '../model/job-offer-wishlist';

@Injectable({
  providedIn: 'root'
})
export class JobOfferWishlistService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getWishlist(vendorName: string, slugTitle: string): Observable<JobOfferWishlist> {
    return this.http.get<JobOfferWishlist>(`${this.host}/api/vendors/${vendorName}/job-offers/${slugTitle}/wishlist`, undefined);
  }

  public getAllWishlist(): Observable<JobOfferWishlist[]> {
    return this.http.get<JobOfferWishlist[]>(`${this.host}/api/job-wishlists`);
  }

  public addWishlist(vendorName: string, slugTitle: string): Observable<JobOfferWishlist> {
    return this.http.post<JobOfferWishlist>(`${this.host}/api/vendors/${vendorName}/job-offers/${slugTitle}/wishlist`, undefined);
  }

  public deleteWishlist(id: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(`${this.host}/api/job-wishlists/${id}`);
  }
}
