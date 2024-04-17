import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceOffer } from 'src/app/model/service-offer';
import { ServiceOfferService } from 'src/app/service/service-offer.service';

@Component({
  selector: 'app-vendor-service',
  templateUrl: './vendor-service.component.html',
  styleUrls: ['./vendor-service.component.css']
})
export class VendorServiceComponent implements OnInit{
  private serviceOfferSlugTitle!: string;
  public serviceOffer!: ServiceOffer;

  constructor(private serviceOfferService: ServiceOfferService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.serviceOfferSlugTitle = this.route.snapshot.params['serviceTitle'];
    this.getServiceOffer();
  }

  private getServiceOffer() {
    this.serviceOfferService.getServiceOfferDetail(this.serviceOfferSlugTitle).subscribe({
      next: response => {
        this.serviceOffer = response;
      }
    })
  }
}
