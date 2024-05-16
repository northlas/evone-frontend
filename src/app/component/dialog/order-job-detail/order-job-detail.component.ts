import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { JobTransaction } from 'src/app/model/job-transaction';
import { JobTransactionParam } from 'src/app/model/job-transaction-param';
import { JobTransactionService } from 'src/app/service/job-transaction.service';

declare let snap: any;

@Component({
  selector: 'app-order-job-detail',
  templateUrl: './order-job-detail.component.html',
  styleUrls: ['./order-job-detail.component.css']
})
export class OrderJobDetailComponent implements OnInit, OnDestroy{
  public jobTransaction!: JobTransaction;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private jobTransactionService: JobTransactionService) {}

  ngOnInit(): void {
    this.jobTransaction = this.data.jobTransaction;
    if (this.jobTransaction.status == 0) {
      snap.embed(this.jobTransaction.id, {
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
    const param = {} as JobTransactionParam;
    param.id = this.jobTransaction.id;
    param.status = status;
    this.jobTransactionService.putTransaction(param).subscribe({
      next: (response: JobTransaction) => {
        this.jobTransaction.status = response.status;
      }
    })
  }
}
