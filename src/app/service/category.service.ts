import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private host = environment.apiUrl;
  public categories = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categories.asObservable();

  constructor(private http:HttpClient) { }

  public getAllCategory(refresh: boolean): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.host}/api/categories`).pipe(map(
      (response: Category[]) => {
        if(refresh) this.categories.next(response);
        return response;
      }
    ));
  }
}
