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
    if (this.requestMatchers(request.url, Constant.PUBLIC_GET_URL) && request.method === 'GET') {
      return next.handle(request);
    }

    if (this.requestMatchers(request.url, Constant.PUBLIC_POST_URL) && request.method !== 'GET') {
      this.loadingRef = this.loadingService.open();
      return next.handle(request).pipe(finalize(() => this.loadingRef.close()));
    }

    this.authService.loadToken();
    const token = this.authService.getToken();

    if (request.method !== 'GET') {
      this.loadingRef = this.loadingService.open();
      return next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}})).pipe(finalize(() => this.loadingRef.close()));
    }

    return next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}}));
  }

  private requestMatchers(url: string, publicUrls: string[]): boolean {
    let isIncluded = false;
    for(let publicUrl of publicUrls) {
      let urls = url.split('/');
      let publics = publicUrl.split('/');
      if (urls.length == publics.length) {
        isIncluded = urls.find((value, index) => !publics.includes(value) && publics[index] !== '**') == undefined;
      }
      if (isIncluded) return isIncluded;
    }
    return isIncluded;
  }
}
