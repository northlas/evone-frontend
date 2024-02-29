import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { LoginComponent } from '../dialog/login/login.component';

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
    dialogConfig.width = '600px';
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: () => {
        if(this.authService.isUserLoggedIn()) {
          window.location.reload(); 
        }
      }
    })
  }
}