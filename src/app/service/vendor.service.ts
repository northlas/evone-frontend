import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Vendor } from '../model/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllVendor(category: string): Observable<Vendor[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<Vendor[]>(`${this.host}/api/vendors`, {params: params})
  }
}
