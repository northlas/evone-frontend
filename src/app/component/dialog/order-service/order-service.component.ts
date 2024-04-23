import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from 'src/app/model/customer';
import { ServiceOffer } from 'src/app/model/service-offer';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrls: ['./order-service.component.css']
})
export class OrderServiceComponent implements OnInit{
  public customer!: Customer;
  public form = this.formBuilder.group([

  ]);

  constructor(@Inject(MAT_DIALOG_DATA) public serviceOffer: ServiceOffer, private customerService: CustomerService, private authService: AuthenticationService, private formBuilder: FormBuilder) {}

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
}
