import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobTransaction } from 'src/app/model/job-transaction';
import { JobTransactionParam } from 'src/app/model/job-transaction-param';
import { ReviewRequest } from 'src/app/model/review-request';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';
import { JobTransactionService } from 'src/app/service/job-transaction.service';
import { ServiceTransactionService } from 'src/app/service/service-transaction.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public request: ReviewRequest, private serviceTransactionService: ServiceTransactionService, private jobTransactionService: JobTransactionService, private dialogRef: MatDialogRef<ReviewComponent>) {}

  public onSubmit() {
    if (this.request.isService) {
      const param = {} as ServiceTransactionParam;
      param.id = this.request.transaction.id;
      param.rating = this.request.transaction.rating;
      param.review = this.request.transaction.review;
      this.serviceTransactionService.putReview(param).subscribe({
        next: () => {
          this.dialogRef.close(true)
        }
      })
    }
    else {
      const param = {} as JobTransactionParam;
      param.id = this.request.transaction.id;
      param.rating = this.request.transaction.rating;
      param.review = this.request.transaction.review;
      this.jobTransactionService.putReview(param).subscribe({
        next: () => {
          this.dialogRef.close(true)
        }
      })
    }
  }
}
