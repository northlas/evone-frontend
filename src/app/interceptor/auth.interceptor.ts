import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { LoadingOverlayRef, LoadingService } from '../service/loading.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private loadingRef!: LoadingOverlayRef;

  constructor(private authService: AuthenticationService, private loadingService: LoadingService, private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isUserLoggedIn()) {
      this.authService.loadToken();
      const token = this.authService.getToken();

      if (request.method === 'GET') {
        return next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}})).pipe(
          catchError((error : HttpErrorResponse) => {
                      this.notificationService.notify(NotificationType.ERROR, error.error ? error.error.message : error.message);
                      return throwError(() => error);})
        );
      }

      this.loadingRef = this.loadingService.open();
      return next.handle(request.clone({setHeaders: {Authorization: `Bearer ${token}`}})).pipe(
        catchError((error : HttpErrorResponse) => {
                    this.notificationService.notify(NotificationType.ERROR, error.error ? error.error.message : error.message);
                    return throwError(() => error);}),
        finalize(() => this.loadingRef.close())
      );
    }

    if (request.method === 'GET') {
      return next.handle(request).pipe(
        catchError((error : HttpErrorResponse) => {
                    this.notificationService.notify(NotificationType.ERROR, error.error ? error.error.message : error.message);
                    return throwError(() => error);})
      );
    }

    this.loadingRef = this.loadingService.open();
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) => {
                  this.notificationService.notify(NotificationType.ERROR, error.error ? error.error.message : error.message);
                  return throwError(() => error);}),
      finalize(() => this.loadingRef.close())
    );
  }
}
