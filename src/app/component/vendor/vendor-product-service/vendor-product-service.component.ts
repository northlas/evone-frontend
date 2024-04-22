import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceOffer } from 'src/app/model/service-offer';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ServiceOfferService } from 'src/app/service/service-offer.service';
import { AddServiceComponent } from '../../dialog/add-service/add-service.component';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';

@Component({
  selector: 'app-vendor-product-service',
  templateUrl: './vendor-product-service.component.html',
  styleUrls: ['./vendor-product-service.component.css']
})
export class VendorProductServiceComponent implements OnInit{
  @Input() params!: HttpParams;

  public searchParam = {} as VendorServiceOfferParam;
  public serviceOffers: ServiceOffer[] = [];
  public isLoading: boolean = true;

  constructor(private serviceOfferService: ServiceOfferService, private authService: AuthenticationService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.router.events.forEach(event => {
      if (event instanceof Scroll) {
        Object.assign(this.searchParam, this.route.snapshot.queryParams);
        this.getServiceOffers();
      }
    })
  }

  ngOnInit(): void {
    
  }

  private getServiceOffers() {
    console.log(this.searchParam)
    this.serviceOfferService.getAllServiceOfferByVendor(this.authService.getSlugName(), this.searchParam).subscribe({
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
