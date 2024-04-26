import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ServiceTransaction } from 'src/app/model/service-transaction';

declare let snap: any;

@Component({
  selector: 'app-order-service-detail',
  templateUrl: './order-service-detail.component.html',
  styleUrls: ['./order-service-detail.component.css']
})
export class OrderServiceDetailComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.serviceTransaction.status == 0) {
      snap.embed(this.serviceTransaction.id, {
        embedId: 'snap-container'
      })
    }
  }

  get serviceTransaction() {
    return this.data.serviceTransaction as ServiceTransaction;
  }

  get picture() {
    return this.data.picture as SafeResourceUrl;
  }
}
