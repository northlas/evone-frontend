import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Occasion } from '../model/occasion';

@Injectable({
  providedIn: 'root'
})
export class OccasionService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllOccasion(): Observable<Occasion[]> {
    return this.http.get<Occasion[]>(`${this.host}/api/occasions`);
  }
}
