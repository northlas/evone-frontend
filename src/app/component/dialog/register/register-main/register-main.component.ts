import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.component.html',
  styleUrls: ['./register-main.component.css']
})
export class RegisterMainComponent {
  public state = 'main'

  constructor() {}

  public changeState(state: string) {
    this.state = state;
  }
}
