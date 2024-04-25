import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServiceOffer } from 'src/app/model/service-offer';
import { ServiceOfferService } from 'src/app/service/service-offer.service';
import { OrderServiceComponent } from '../../dialog/order-service/order-service.component';

@Component({
  selector: 'app-vendor-service',
  templateUrl: './vendor-service.component.html',
  styleUrls: ['./vendor-service.component.css']
})
export class VendorServiceComponent implements OnInit{
  private vendorSlugName!: string;
  private serviceOfferSlugTitle!: string;
  public serviceOffer!: ServiceOffer;

  constructor(private serviceOfferService: ServiceOfferService, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.vendorSlugName = this.route.snapshot.params['vendorName'];
    this.serviceOfferSlugTitle = this.route.snapshot.params['serviceTitle'];
    this.getServiceOffer();
  }

  private getServiceOffer() {
    this.serviceOfferService.getServiceOfferDetail(this.vendorSlugName, this.serviceOfferSlugTitle).subscribe({
      next: response => {
        this.serviceOffer = response;
      }
    })
  }

  public onOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.serviceOffer;
    dialogConfig.width = '50vw';
    this.dialog.open(OrderServiceComponent, dialogConfig);
  }
}
