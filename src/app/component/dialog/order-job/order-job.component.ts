import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/model/customer';
import { JobOffer } from 'src/app/model/job-offer';
import { JobTransaction } from 'src/app/model/job-transaction';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { JobTransactionService } from 'src/app/service/job-transaction.service';

declare let snap: any;

@Component({
  selector: 'app-order-job',
  templateUrl: './order-job.component.html',
  styleUrls: ['./order-job.component.css']
})
export class OrderJobComponent implements OnInit{
  public customer!: Customer;
  public form = this.formBuilder.group({
  });

  constructor(@Inject(MAT_DIALOG_DATA) public jobOffer: JobOffer, private customerService: CustomerService, private jobTransactionService: JobTransactionService, private authService: AuthenticationService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<OrderJobComponent>) {}

  ngOnInit(): void {
    this.getCustomer();
  }

  private getCustomer() {
    this.customerService.getCustomer(this.authService.getSubject()).subscribe({
      next: response => {
        this.customer = response;
      }
    })
  }


  public onSubmit() {
    const jobTransaction = {} as JobTransaction;

    this.jobTransactionService.postTransaction(this.jobOffer.vendor.slugName, this.jobOffer.slugTitle, jobTransaction).subscribe({
      next: response => {
        this.dialogRef.close(response);
      }
    })
  }
}
