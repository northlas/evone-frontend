import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  public getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.host}/api/categories`);
  }
}
