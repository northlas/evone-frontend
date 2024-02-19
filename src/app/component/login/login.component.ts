import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { BaseResponse } from 'src/app/model/base-response';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username?: string;
  public password?: string;

  constructor(private router: Router, private authService: AuthenticationService) {}

  public onLogin(): void {
    const auth = btoa(this.username + ':' + this.password);
    console.log(auth)
    this.authService.login(auth).subscribe({
      next:(response: HttpResponse<BaseResponse>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN)!;
        this.authService.saveToken(token);
        this.router.navigate(['/'])
      },
      error: () => {
        this.password = undefined;
      }
    })
  }
}
