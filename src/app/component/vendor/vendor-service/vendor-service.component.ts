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

@Component({
  selector: 'app-vendor-service',
  templateUrl: './vendor-service.component.html',
  styleUrls: ['./vendor-service.component.css']
})
export class VendorServiceComponent implements OnInit{
  private vendorSlugName!: string;
  private serviceOfferSlugTitle!: string;
  public serviceOffer!: ServiceOffer;
  public pictures: SafeResourceUrl[] = [];

  constructor(private serviceOfferService: ServiceOfferService, private route: ActivatedRoute, private dialog: MatDialog, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.vendorSlugName = this.route.snapshot.params['vendorName'];
    this.serviceOfferSlugTitle = this.route.snapshot.params['serviceTitle'];
    this.getServiceOffer();
  }

  private getServiceOffer() {
    this.serviceOfferService.getServiceOfferDetail(this.vendorSlugName, this.serviceOfferSlugTitle).subscribe({
      next: response => {
        this.serviceOffer = response;
        this.getPictures();
      }
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
}
