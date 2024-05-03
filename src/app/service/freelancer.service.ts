import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Freelancer } from '../model/freelancer';

@Injectable({
  providedIn: 'root'
})
export class FreelancerService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getProfile(): Observable<Freelancer> {
    return this.http.get<Freelancer>(`${this.host}/api/freelancers/profile`);
  }
}
