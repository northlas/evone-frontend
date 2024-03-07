import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Platform } from '../model/platform';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllPlatform(): Observable<Platform[]> {
    return this.http.get<Platform[]>(`${this.host}/api/platforms`);
  }
}
