import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceOffer } from 'src/app/model/service-offer';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ServiceOfferService } from 'src/app/service/service-offer.service';
import { AddServiceComponent } from '../../dialog/add-service/add-service.component';

@Component({
  selector: 'app-vendor-product-service',
  templateUrl: './vendor-product-service.component.html',
  styleUrls: ['./vendor-product-service.component.css']
})
export class VendorProductServiceComponent implements OnInit{
  @Input() params!: HttpParams;

  public serviceOffers: ServiceOffer[] = [];
  public isLoading: boolean = true;

  constructor(private serviceOfferService: ServiceOfferService, private authService: AuthenticationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getServiceOffers();
  }

  private getServiceOffers() {
    this.serviceOfferService.getAllServiceOfferByVendor(this.authService.getSlugName()).subscribe({
      next: response => {
        this.serviceOffers = response;
        this.isLoading = false;
      }
    })
  }

  public addService() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false
    this.dialog.open(AddServiceComponent, dialogConfig)
  }

  public editService(data: ServiceOffer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false
    dialogConfig.data = data;
    this.dialog.open(AddServiceComponent, dialogConfig);
  }
}
