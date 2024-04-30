import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { from, concatMap } from 'rxjs';
import { ServiceOfferWishlist } from 'src/app/model/service-offer-wishlist';
import { S3Service } from 'src/app/service/s3.service';
import { ServiceOfferWishlistService } from 'src/app/service/service-offer-wishlist.service';

@Component({
  selector: 'app-wishlist-service',
  templateUrl: './wishlist-service.component.html',
  styleUrls: ['./wishlist-service.component.css']
})
export class WishlistServiceComponent implements OnInit{
  public wishlists: ServiceOfferWishlist[] = [];
  public pictureMap = new Map<string, SafeResourceUrl>();

  constructor(private serviceOfferWishlistService: ServiceOfferWishlistService, private s3Service: S3Service, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getWishlists();
  }

  private getWishlists() {
    this.serviceOfferWishlistService.getAllWishlist().subscribe({
      next: (response: ServiceOfferWishlist[]) => {
        this.wishlists = response;
        console.log(response)
        response.forEach(value => this.getPictures(value.id, value.serviceOffer.pictures[0].id));
      }
    })
  }

  private getPictures(wishlistId: string, pictureId: string) {
    from([pictureId])
    .pipe(concatMap(picture => this.s3Service.getImage('service offer/' + picture)))
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
