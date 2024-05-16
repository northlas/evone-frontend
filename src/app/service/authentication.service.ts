import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../component/dialog/login/login.component';
import { HeaderType } from '../enum/header-type.enum';
import { BaseResponse } from '../model/base-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private host = environment.apiUrl;
  private token: string | null = null;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  public login(auth: string): Observable<HttpResponse<BaseResponse>> {
    const header = new HttpHeaders({Authorization: HeaderType.BASIC_AUTH + auth});
    return this.http.post<BaseResponse>(`${this.host}/api/auth/login`, null, {observe: 'response', headers: header})
  }

  public openLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (isLoggedIn: boolean) => {
        if(isLoggedIn) {
          window.location.reload();
        }
      }
    })
  }

  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string | null {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if(this.token != null && this.token != '') {
      const subbed = this.getSubject();
      if(subbed != null || subbed != '') {
        return true;
      }
    }

    this.clearToken();
    return false;
  }

  public hasAuthority(value: string): boolean {
    const authorities: string[] = this.jwtHelper.decodeToken(this.token!)?.authorities;
    return authorities?.includes(value);
  }

  public getSubject(): string {
    return this.jwtHelper.decodeToken(this.token!).sub;
  }

  public getUserName(): string {
    return this.jwtHelper.decodeToken(this.token!).name;
  }

  public getSlugName(): string {
    return this.jwtHelper.decodeToken(this.token!).slugName;
  }
}
