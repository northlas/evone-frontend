import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';
import { ServiceTransactionService } from 'src/app/service/service-transaction.service';

declare let snap: any;

@Component({
  selector: 'app-order-service-detail',
  templateUrl: './order-service-detail.component.html',
  styleUrls: ['./order-service-detail.component.css']
})
export class OrderServiceDetailComponent implements OnInit, OnDestroy{
  public serviceTransaction!: ServiceTransaction;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private serviceTransactionService: ServiceTransactionService) {}

  ngOnInit(): void {
    this.serviceTransaction = this.data.serviceTransaction;
    if (this.serviceTransaction.status == 0) {
      snap.embed(this.serviceTransaction.id, {
        embedId: 'snap-container'
      })
    }
  }

  ngOnDestroy(): void {
    snap.hide();
  }

  get picture() {
    return this.data.picture as SafeResourceUrl;
  }

  get isVendor() {
    return this.data.isVendor;
  }

  public onSubmit(status: number) {
    const param = {} as ServiceTransactionParam;
    param.id = this.serviceTransaction.id;
    param.status = status;
    this.serviceTransactionService.putTransaction(param).subscribe({
      next: (response: ServiceTransaction) => {
        this.serviceTransaction.status = response.status;
      }
    })
  }
}
