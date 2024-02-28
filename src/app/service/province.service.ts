import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Province } from '../model/province';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllProvince(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.host}/api/provinces`);
  }
}
