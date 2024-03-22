import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { BaseResponse } from 'src/app/model/base-response';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username?: string;
  public password?: string;

  constructor(private dialogRef: MatDialogRef<LoginComponent>, private authService: AuthenticationService, private notificationService: NotificationService) {}

  public onLogin(): void {
    const auth = btoa(this.username + ':' + this.password);
    this.authService.login(auth).subscribe({
      next:(response: HttpResponse<BaseResponse>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN)!;
        this.authService.saveToken(token);
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.password = undefined;
        this.notificationService.notify(NotificationType.ERROR, error.error.message);
      }
    })
  }
}
