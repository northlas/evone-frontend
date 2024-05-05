import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { LoginComponent } from '../dialog/login/login.component';
import { RegisterMainComponent } from '../dialog/register/register-main/register-main.component';
import { Router } from '@angular/router';
import { Role } from 'src/app/enum/role.enum';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{
  public isVendor!: boolean;
  public isLoggedIn!: boolean;
  public userName?: string;

  constructor(private authService: AuthenticationService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.isVendor = this.authService.hasAuthority(Role.ROLE_VENDOR);
    if (this.isLoggedIn) this.userName = this.authService.getUserName();
  }

  public openLogin() {
    this.authService.openLogin();
  }

  public openRegister() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '400px';
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(RegisterMainComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (openLogin: boolean) => {
        if(openLogin === true) {
          this.openLogin();
        }
      }
    })
  }

  public loadSetting(menu: string) {
    this.router.navigateByUrl(menu);
  }

  public onLogout() {
    this.authService.clearToken();
    window.location.reload();
  }
}
