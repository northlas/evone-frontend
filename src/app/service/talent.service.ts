import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class TalentService {
  private host = environment.apiUrl;
  public talents = new BehaviorSubject<Category[]>([]);
  public talents$ = this.talents.asObservable();

  constructor(private http:HttpClient) { }
  public getAllTalent(refresh: boolean): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.host}/api/talents`).pipe(map(
        (response: Category[]) => {
          if(refresh) this.talents.next(response);
          return response;
        }
      ));
    }
//   constructor() { }
}
