import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { LoginComponent } from '../dialog/login/login.component';
import { RegisterMainComponent } from '../dialog/register/register-main/register-main.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{
  public isLoggedIn!: boolean;
  public userName?: string;

  constructor(private authService: AuthenticationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    if (this.isLoggedIn) this.userName = this.authService.getUserName();
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

  public onLogout() {
    this.authService.clearToken();
    window.location.reload();
  }
}