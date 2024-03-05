import { Component } from '@angular/core';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.component.html',
  styleUrls: ['./register-main.component.css']
})
export class RegisterMainComponent {
  public state = 'vendor'

  constructor() {}

  public changeState(state: string) {
    this.state = state;
  }
}
