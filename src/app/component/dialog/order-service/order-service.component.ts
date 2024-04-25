import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from 'src/app/model/customer';
import { ServiceOffer } from 'src/app/model/service-offer';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ServiceTransactionService } from 'src/app/service/service-transaction.service';

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrls: ['./order-service.component.css']
})
export class OrderServiceComponent implements OnInit{
  public customer!: Customer;
  public today = new Date();
  public totalPrice = this.serviceOffer.price;
  public totalDays = 0;
  public form = this.formBuilder.group({
    occasion: new FormControl<number | null>(null),
    qty: new FormControl<number | null>(1),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null)
  });

  constructor(@Inject(MAT_DIALOG_DATA) public serviceOffer: ServiceOffer, private customerService: CustomerService, private serviceTransactionService: ServiceTransactionService, private authService: AuthenticationService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getCustomer();
    this.qtyListener();
    this.dateListener();
  }

  private calculateTotalPrice() {
    this.totalPrice = this.serviceOffer.price * this.form.controls.qty.value! *  (this.totalDays == 0 ? 1 : this.totalDays);
  }

  private qtyListener() {
    this.form.controls.qty.valueChanges.subscribe(value => {
      if (value == null) {
        this.form.controls.qty.setValue(1);
      }
      this.calculateTotalPrice();
    })
  }

  private dateListener() {
    this.form.controls.endDate.valueChanges.subscribe(value => {
      if (value == null) {
        this.totalDays = 0;
      } else {
        this.totalDays = this.dateDiffInDays(this.form.controls.startDate.value!, this.form.controls.endDate.value!);
        this.calculateTotalPrice();
      }
    })
  }
  
  private getCustomer() {
    this.customerService.getCustomer(this.authService.getSubject()).subscribe({
      next: response => {
        this.customer = response;
      }
    })
  }

  private dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;
  }

  public checkEndDate() {
    if (this.form.controls.endDate.value == null) {
      this.form.controls.endDate.setValue(this.form.controls.startDate.value)
    }
  }

  public onSubmit() {
    const serviceTransaction = {} as ServiceTransaction;
    serviceTransaction.occasionId = this.form.controls.occasion.value!;
    serviceTransaction.qty = this.form.controls.qty.value!;
    serviceTransaction.startDt = this.form.controls.startDate.value!;
    serviceTransaction.endDt = this.form.controls.endDate.value!;
    serviceTransaction.paymentAmount = this.totalPrice;

    this.serviceTransactionService.postTransaction(this.serviceOffer.slugTitle, serviceTransaction).subscribe({
      next: response => {
        console.log(response);
      }
    })
  }
}