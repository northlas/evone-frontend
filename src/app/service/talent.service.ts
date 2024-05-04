import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Talent } from '../model/talent';

@Injectable({
  providedIn: 'root'
})
export class TalentService {
  private host = environment.apiUrl;
  public talents = new BehaviorSubject<Talent[]>([]);
  public talents$ = this.talents.asObservable();

  constructor(private http:HttpClient) { }

  public getAllTalent(refresh: boolean): Observable<Talent[]> {
    return this.http.get<Talent[]>(`${this.host}/api/talents`).pipe(map(
      (response: Talent[]) => {
        if(refresh) this.talents.next(response);
        return response;
      }
    ));
  }
}
