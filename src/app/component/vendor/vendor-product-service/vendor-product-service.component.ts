import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { ServiceOffer } from 'src/app/model/service-offer';
import { assignQueryParams, VendorServiceOfferParam } from 'src/app/model/vendor-service-offer-param';
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

  public searchParam = {} as VendorServiceOfferParam;
  public serviceOffers: ServiceOffer[] = [];
  public isLoading: boolean = true;
  public isInitiated = false;

  constructor(private serviceOfferService: ServiceOfferService, private authService: AuthenticationService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.router.events.forEach(event => {
      if (event instanceof Scroll) {
        const queryParams = assignQueryParams(route.snapshot.queryParams);
        const isEmpty = (Object.keys(queryParams).length + Object.keys(this.searchParam).length) == 0;
        const isChangeParam = isEmpty || (JSON.stringify(this.searchParam) !== JSON.stringify(queryParams));
        if (isChangeParam && !this.isInitiated) {
          this.serviceOffers = [];
          this.searchParam = queryParams;
          this.getServiceOffers();
        }
      }
    })
  }

  ngOnInit(): void {
    this.isInitiated = true;
    this.getServiceOffers();
  }

  private getServiceOffers() {
    this.serviceOfferService.getAllServiceOffer(this.authService.getSlugName(), this.searchParam, 1).subscribe({
      next: response => {
        this.serviceOffers = response.items;
        this.isLoading = false;
        this.isInitiated = false;
      }
    })
  }

  public addService() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false
    this.dialog.open(AddServiceComponent, dialogConfig).afterClosed().subscribe({
      next: (value: boolean | undefined) => {
        if(value) this.getServiceOffers();
      }
    });
  }

  public editService(data: ServiceOffer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false
    dialogConfig.data = data;
    this.dialog.open(AddServiceComponent, dialogConfig).afterClosed().subscribe({
      next: (value: boolean | undefined) => {
        if(value) this.getServiceOffers();
      }
    });;
  }
}
