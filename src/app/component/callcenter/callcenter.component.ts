import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

@Component({
  selector: 'app-callcenter',
  templateUrl: './callcenter.component.html',
  styleUrls: ['./callcenter.component.css'],
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule]
})
export class CallcenterComponent{

}
