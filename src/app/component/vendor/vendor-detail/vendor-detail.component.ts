import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffer } from 'src/app/model/job-offer';
import { ServiceOffer } from 'src/app/model/service-offer';
import { Vendor } from 'src/app/model/vendor';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { JobService } from 'src/app/service/job.service';
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
  public jobOffers: JobOffer[] = [];
  public isLoading = true;
  public isLoggedIn!: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private vendorService: VendorService, private authService: AuthenticationService, private serviceOfferService: ServiceOfferService, private jobService: JobService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.vendorSlugName = this.route.snapshot.params['vendorName'];
    this.getVendorDetail();
    this.getServiceOffers();
    this.getJobOffers();
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

  private getJobOffers() {
    this.jobService.getAllJobEtalase(this.vendorSlugName, undefined, 1).subscribe({  
      next: response => {
        this.jobOffers = response.items;
        this.isLoading = false;
      }
    })
  }

  public onChat() {
    if (!this.isLoggedIn) {
      this.authService.openLogin();
    }
    else {
      this.router.navigate(['/chat'], {state: {recipient: this.vendor.email}})
    }
  }
}
