import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { concatMap, from } from 'rxjs';
import { Role } from 'src/app/enum/role.enum';
import { BasePageResponse } from 'src/app/model/base-page-response';
import { JobTransaction } from 'src/app/model/job-transaction';
import { JobTransactionParam } from 'src/app/model/job-transaction-param';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { JobTransactionService } from 'src/app/service/job-transaction.service';
import { S3Service } from 'src/app/service/s3.service';
import { JobOrderFilterComponent } from '../../dialog/job-order-filter/job-order-filter.component';
import { OrderJobDetailComponent } from '../../dialog/order-job-detail/order-job-detail.component';
import { ReviewComponent } from '../../dialog/review/review.component';
import { ReviewRequest } from 'src/app/model/review-request';

@Component({
  selector: 'app-job-order',
  templateUrl: './job-order.component.html',
  styleUrls: ['./job-order.component.css']
})
export class JobOrderComponent implements OnInit{
   @ViewChild('input') searchField!: ElementRef;

   public isVendor!: boolean;
   private searchParam = {} as JobTransactionParam;
   private isReviewing = false;
   public filterCount = 0;
   public reviewMap = new Map<string, number>();
   public page!: BasePageResponse<JobTransaction>;
   public pictureMap = new Map<string, SafeResourceUrl>();

   constructor(private jobTransactionService: JobTransactionService, private s3Service: S3Service, private authService: AuthenticationService, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

   ngOnInit(): void {
     this.isVendor = this.authService.hasAuthority(Role.ROLE_VENDOR);
     this.searchParam.page = 1;
     this.getJobTransactions();
   }

   private getJobTransactions() {
     this.jobTransactionService.getTransactionByUser(this.searchParam).subscribe({
       next: response => {
         this.page = response;
         response.items.forEach(value => {
          this.reviewMap.set(value.id, value.rating);
           if (!this.pictureMap.has(value.id)) {
             this.getPictures(value.id, value.jobOffer.pictures[0].id);
           }
         })
       }
     })
   }

   private getPictures(serviceTransactionId: string, pictureId: string) {
     from([pictureId])
     .pipe(concatMap(picture => this.s3Service.getImage('job offer/' + picture)))
     .pipe(concatMap(response => response.Body!.transformToByteArray()))
     .subscribe(body => {
       let binary = '';
       for (let i = 0; i < body.length; i++) {
         binary += String.fromCharCode(body[i]);
       }
       this.pictureMap.set(serviceTransactionId, this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary)));
     })
   }

   private countFilter() {
     let count = 0;
     if(this.searchParam.talent != undefined) count++;
     if(this.searchParam.status != undefined) count++;
     this.filterCount = count;
   }

   public search(param: string) {
     if(param.length == 0) {
       const {title, ...param} = this.searchParam;
       this.searchParam = param as JobTransactionParam;
     }
     else this.searchParam.title = param;
     this.getJobTransactions();
   }

   public onFilter() {
     const dialogConfig = new MatDialogConfig();
     dialogConfig.data = {'jobTransactionParam' : this.searchParam, 'isVendor': this.isVendor};
     dialogConfig.autoFocus = false;
     const dialogRef = this.dialog.open(JobOrderFilterComponent, dialogConfig);
     dialogRef.afterClosed().subscribe({
       next: (param: JobTransactionParam | undefined) => {
         if (param) {
           this.searchParam = param;
           this.countFilter();
           this.getJobTransactions();
         }
       }
     })
   }

   public onDetail(jobTransaction: JobTransaction) {
    if (!this.isReviewing) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {'jobTransaction' : jobTransaction, 'picture': this.pictureMap.get(jobTransaction.id), 'isVendor': this.isVendor};
      dialogConfig.autoFocus = false;
      this.dialog.open(OrderJobDetailComponent, dialogConfig);
    }
   }

   public onReview(jobTransaction: JobTransaction) {
    this.isReviewing = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {isService: false, transaction: jobTransaction} as ReviewRequest;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = '40%';
    const dialogRef = this.dialog.open(ReviewComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (review: boolean | undefined) => {
        if (review) {
          this.reviewMap.set(jobTransaction.id, jobTransaction.rating);
        }
        else {
          jobTransaction.review = '';
          jobTransaction.rating = 0;
        }
        this.isReviewing = false;
      }
    })
  }
}
