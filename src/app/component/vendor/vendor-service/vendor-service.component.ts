import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ServiceOffer } from 'src/app/model/service-offer';
import { ServiceOfferService } from 'src/app/service/service-offer.service';
import { OrderServiceComponent } from '../../dialog/order-service/order-service.component';
import { S3Service } from 'src/app/service/s3.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from } from 'rxjs';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { OrderServiceDetailComponent } from '../../dialog/order-service-detail/order-service-detail.component';
import { ServiceOfferWishlistService } from 'src/app/service/service-offer-wishlist.service';
import { ServiceOfferWishlist } from 'src/app/model/service-offer-wishlist';
import { BaseResponse } from 'src/app/model/base-response';

@Component({
  selector: 'app-vendor-service',
  templateUrl: './vendor-service.component.html',
  styleUrls: ['./vendor-service.component.css']
})
export class VendorServiceComponent implements OnInit{
  public wishlist?: ServiceOfferWishlist;
  private vendorSlugName!: string;
  private serviceOfferSlugTitle!: string;
  public serviceOffer!: ServiceOffer;
  public pictures: SafeResourceUrl[] = [];
  public responsiveOptions = [
    {
      breakpoint: '1280px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '720px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1
    }
  ]

  constructor(private serviceOfferService: ServiceOfferService, private serviceOfferWishlistService: ServiceOfferWishlistService, private route: ActivatedRoute, private dialog: MatDialog, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.vendorSlugName = this.route.snapshot.params['vendorName'];
    this.serviceOfferSlugTitle = this.route.snapshot.params['serviceTitle'];
    this.getServiceOffer();
  }

  private getServiceOffer() {
    from(this.serviceOfferService.getServiceOfferDetail(this.vendorSlugName, this.serviceOfferSlugTitle))
    .pipe(concatMap(serviceOffer => {
      this.serviceOffer = serviceOffer;
      this.getPictures();
      return this.serviceOfferWishlistService.getWishlist(serviceOffer.vendor.slugName, serviceOffer.slugTitle);
    }))
    .subscribe(wishlist => {
      this.wishlist = wishlist;
    })
  }

  private getPictures() {
    from(this.serviceOffer.pictures)
    .pipe(concatMap(picture => this.s3Service.getImage('service offer/' + picture.id)))
    .pipe(concatMap(response => response.Body!.transformToByteArray()))
    .subscribe(body => {
      let binary = '';
      for (let i = 0; i < body.length; i++) {
        binary += String.fromCharCode(body[i]);
      }
      this.pictures.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary)));
    })
  }

  private onPayment(serviceTransaction: ServiceTransaction) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {'serviceTransaction' : serviceTransaction, 'picture': this.pictures[0]};
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = '30%';
    const dialogRef = this.dialog.open(OrderServiceDetailComponent, dialogConfig);
  }

  public onOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.serviceOffer;
    dialogConfig.minWidth = '60%'
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(OrderServiceComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (response: ServiceTransaction | undefined) => {
        if (response) {
          this.onPayment(response);
        }
      }
    })
  }

  public onWishlist() {
    if (this.wishlist?.id) {
      this.serviceOfferWishlistService.deleteWishlist(this.wishlist.id).subscribe({
        next: () => {
          this.wishlist = undefined;
        }
      });
    }
    else {
      this.serviceOfferWishlistService.addWishlist(this.serviceOffer.vendor.slugName, this.serviceOffer.slugTitle).subscribe({
        next: (response: ServiceOfferWishlist) => {
          this.wishlist = response;
          console.log(this.wishlist.id)
        }
      });
    }
  }
}
