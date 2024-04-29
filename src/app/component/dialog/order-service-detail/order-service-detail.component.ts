import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Role } from 'src/app/enum/role.enum';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { AuthenticationService } from 'src/app/service/authentication.service';

declare let snap: any;

@Component({
  selector: 'app-order-service-detail',
  templateUrl: './order-service-detail.component.html',
  styleUrls: ['./order-service-detail.component.css']
})
export class OrderServiceDetailComponent implements OnInit, OnDestroy{
  public isVendor!: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.isVendor = this.authService.hasAuthority(Role.ROLE_VENDOR);
    if (this.serviceTransaction.status == 0) {
      snap.embed(this.serviceTransaction.id, {
        embedId: 'snap-container'
      })
    }
  }

  ngOnDestroy(): void {
    snap.hide();
  }


  get serviceTransaction() {
    return this.data.serviceTransaction as ServiceTransaction;
  }

  get picture() {
    return this.data.picture as SafeResourceUrl;
  }
}
