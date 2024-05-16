import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, of } from 'rxjs';
import { JobOffer } from 'src/app/model/job-offer';
import { JobOfferWishlist } from 'src/app/model/job-offer-wishlist';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { JobOfferWishlistService } from 'src/app/service/job-offer-wishlist.service';
import { JobService } from 'src/app/service/job.service';
import { S3Service } from 'src/app/service/s3.service';
import { OrderJobComponent } from '../../dialog/order-job/order-job.component';


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
  public isLoggedIn!: boolean;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService, private jobOfferWishlistService: JobOfferWishlistService, private router: Router, private dialog: MatDialog, private jobService: JobService, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.slugTitle = this.route.snapshot.params['jobTitle'];
    this.getJobOffer();
  }

  private getJobOffer() {
    from(this.jobService.getJobDetail(this.slugTitle))
    .pipe(concatMap(jobOffer => {
      this.jobOffer = jobOffer;
      this.getPictures();
      return this.isLoggedIn ? this.jobOfferWishlistService.getWishlist(jobOffer.vendor.slugName, jobOffer.slugTitle) : of(undefined);
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
    if (!this.isLoggedIn) {
      this.authService.openLogin();
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.jobOffer;
      dialogConfig.minWidth = '60%'
      dialogConfig.autoFocus = false;
      const dialogRef = this.dialog.open(OrderJobComponent, dialogConfig);
      dialogRef.afterClosed().subscribe
    }
  }

  public onChat() {
    if (!this.isLoggedIn) {
      this.authService.openLogin();
    }
    else {
      this.router.navigate(['/chat'], {state: {recipient: this.jobOffer.vendor.email}})
    }
  }

  public onWishlist() {
    if (!this.isLoggedIn) {
      this.authService.openLogin();
    }
    else {
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
}
