import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServiceOffer } from 'src/app/model/service-offer';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ServiceOfferService } from 'src/app/service/service-offer.service';

@Component({
  selector: 'app-vendor-product-service',
  templateUrl: './vendor-product-service.component.html',
  styleUrls: ['./vendor-product-service.component.css']
})
export class VendorProductServiceComponent implements OnInit{
  private params: HttpParams = new HttpParams();
  public serviceOffers: ServiceOffer[] = [];
  public isLoading: boolean = true;

  constructor(private serviceOfferService: ServiceOfferService, private authService: AuthenticationService) {}

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
}
