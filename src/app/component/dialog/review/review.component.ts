import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';
import { ServiceTransactionService } from 'src/app/service/service-transaction.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public serviceTransaction: ServiceTransaction, private serviceTransactionService: ServiceTransactionService, private dialogRef: MatDialogRef<ReviewComponent>) {}

  public onSubmit() {
    const param = {} as ServiceTransactionParam;
    param.id = this.serviceTransaction.id;
    param.rating = this.serviceTransaction.rating;
    param.review = this.serviceTransaction.review;
    this.serviceTransactionService.putReview(param).subscribe({
      next: () => {
        this.dialogRef.close(true)
      }
    })
  }
}
