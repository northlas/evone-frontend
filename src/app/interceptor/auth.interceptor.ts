import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { LoadingOverlayRef, LoadingService } from '../service/loading.service';
import { Constant } from '../constant/constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private loadingRef!: LoadingOverlayRef;

  constructor(private authService: AuthenticationService, private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (Constant.PUBLIC_POST_URL.includes(request.url) && request.method === 'POST') {
      this.loadingRef = this.loadingService.open();
      return next.handle(request).pipe(finalize(() => this.loadingRef.close()));
    }

    if (request.method !== 'GET') {
      this.authService.loadToken();
      const token = this.authService.getToken();
      this.loadingRef = this.loadingService.open();
      return next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}})).pipe(finalize(() => this.loadingRef.close()));
    }

    return next.handle(request);
  }
}
