import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from } from 'rxjs';
import { JobOfferWishlist } from 'src/app/model/job-offer-wishlist';
import { JobOfferWishlistService } from 'src/app/service/job-offer-wishlist.service';
import { S3Service } from 'src/app/service/s3.service';

@Component({
  selector: 'app-wishlist-job',
  templateUrl: './wishlist-job.component.html',
  styleUrls: ['./wishlist-job.component.css']
})
export class WishlistJobComponent implements OnInit{
  public wishlists: JobOfferWishlist[] = [];
    public pictureMap = new Map<string, SafeResourceUrl>();

    constructor(private jobOfferWishlistService: JobOfferWishlistService, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
      this.getWishlists();
    }

    private getWishlists() {
      this.jobOfferWishlistService.getAllWishlist().subscribe({
        next: (response: JobOfferWishlist[]) => {
          this.wishlists = response;
          console.log(response)
          response.forEach(value => this.getPictures(value.id, value.jobOffer.pictures[0].id));
        }
      })
    }

    private getPictures(wishlistId: string, pictureId: string) {
      from([pictureId])
      .pipe(concatMap(picture => this.s3Service.getImage('job offer/' + picture)))
      .pipe(concatMap(response => response.Body!.transformToByteArray()))
      .subscribe(body => {
        let binary = '';
        for (let i = 0; i < body.length; i++) {
          binary += String.fromCharCode(body[i]);
        }
        this.pictureMap.set(wishlistId, this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary)));
      })
    }
}
