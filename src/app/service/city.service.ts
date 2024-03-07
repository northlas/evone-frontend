import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { City } from '../model/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllCity(): Observable<City[]> {
    return this.http.get<City[]>(`${this.host}/api/cities`);
  }
}
