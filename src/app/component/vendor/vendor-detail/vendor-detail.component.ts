import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceOffer } from 'src/app/model/service-offer';
import { Vendor } from 'src/app/model/vendor';
import { ServiceOfferService } from 'src/app/service/service-offer.service';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: ['./vendor-detail.component.css']
})
export class VendorDetailComponent implements OnInit{
  private vendorSlugName!: string;
  public vendor!: Vendor;
  public serviceOffers: ServiceOffer[] = [];
  public isLoading = true;

  constructor(private route: ActivatedRoute, private vendorService: VendorService, private serviceOfferService: ServiceOfferService) {}

  ngOnInit(): void {
    this.vendorSlugName = this.route.snapshot.params['vendorName'];
    this.getVendorDetail();
    this.getServiceOffers();
  }

  private getVendorDetail() {
    this.vendorService.getVendorDetail(this.vendorSlugName).subscribe({
      next: response => {
        this.vendor = response;
      }
    })
  }

  private getServiceOffers() {
    this.serviceOfferService.getAllServiceOffer(this.vendorSlugName, undefined, 1).subscribe({
      next: response => {
        this.serviceOffers = response.items;
        this.isLoading = false;
      }
    })
  }
}
