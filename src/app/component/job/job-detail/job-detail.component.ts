import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JobOffer } from 'src/app/model/job-offer';
import { Vendor } from 'src/app/model/vendor';
import { JobService } from 'src/app/service/job.service';
import { VendorService } from 'src/app/service/vendor.service';
import { OrderJobComponent } from '../../dialog/order-job/order-job.component';
import { JobTransaction } from 'src/app/model/job-transaction';
import { S3Service } from 'src/app/service/s3.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from } from 'rxjs';
import { BaseResponse } from 'src/app/model/base-response';
import { JobOfferWishlistService } from 'src/app/service/job-offer-wishlist.service';
import { JobOfferWishlist } from 'src/app/model/job-offer-wishlist';


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit{
  public wishlist?: JobOfferWishlist;
  private slugTitle!: string;
  public jobOffer!: JobOffer;
  public isLoading = true;
  public pictures: SafeResourceUrl[] = [];

  constructor(private route: ActivatedRoute, private vendorService: VendorService, private jobOfferWishlistService: JobOfferWishlistService, private dialog: MatDialog, private jobService: JobService, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.slugTitle = this.route.snapshot.params['jobTitle'];
    this.getJobOffer();
  }

  private getJobOffer() {
      from(this.jobService.getJobDetail(this.slugTitle))
      .pipe(concatMap(jobOffer => {
        this.jobOffer = jobOffer;
        this.getPictures();
        return this.jobOfferWishlistService.getWishlist(jobOffer.vendor.slugName, jobOffer.slugTitle);
      }))
      .subscribe(wishlist => {
        this.wishlist = wishlist;
      })
  }

  private getPictures() {
    from(this.jobOffer.pictures)
    .pipe(concatMap(picture => this.s3Service.getImage('job offer/' + picture.id)))
    .pipe(concatMap(response => response.Body!.transformToByteArray()))
    .subscribe(body => {
      let binary = '';
      for (let i = 0; i < body.length; i++) {
        binary += String.fromCharCode(body[i]);
      }
      this.pictures.push(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary)));
    })
  }


  public onOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.jobOffer;
    dialogConfig.minWidth = '60%'
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(OrderJobComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (response: JobTransaction | undefined) => {

      }
    })
  }

  public onWishlist() {
      if (this.wishlist?.id) {
        this.jobOfferWishlistService.deleteWishlist(this.wishlist.id).subscribe({
          next: () => {
            this.wishlist = undefined;
          }
        });
      }
      else {
        this.jobOfferWishlistService.addWishlist(this.jobOffer.vendor.slugName, this.jobOffer.slugTitle).subscribe({
          next: (response: JobOfferWishlist) => {
            this.wishlist = response;
            console.log(this.wishlist.id)
          }
        });
      }
    }


}
