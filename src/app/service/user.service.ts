import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../model/base-response';
import { User } from '../model/user';
import { Wallet } from '../model/wallet';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getProfile(): Observable<User> {
    return this.http.get<User>(`${this.host}/api/users/profile`);
  }

  public withdrawBalance(wallet: Wallet): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(`${this.host}/api/users/wallets`, wallet);
  }
}
