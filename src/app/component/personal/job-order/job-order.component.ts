import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { from, concatMap } from 'rxjs';
import { BasePageResponse } from 'src/app/model/base-page-response';
import { JobTransaction } from 'src/app/model/job-transaction';
import { JobTransactionParam } from 'src/app/model/job-transaction-param';
import { S3Service } from 'src/app/service/s3.service';
import { JobTransactionService } from 'src/app/service/job-transaction.service';
import { OrderJobDetailComponent } from '../../dialog/order-job-detail/order-job-detail.component';
import { JobOrderFilterComponent } from '../../dialog/job-order-filter/job-order-filter.component';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/role.enum';

@Component({
  selector: 'app-job-order',
  templateUrl: './job-order.component.html',
  styleUrls: ['./job-order.component.css']
})
export class JobOrderComponent implements OnInit{
   @ViewChild('input') searchField!: ElementRef;

   private isVendor!: boolean;
   private searchParam = {} as JobTransactionParam;
   public filterCount = 0;
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
     if(this.searchParam.talent) count++;
     if(this.searchParam.status) count++;
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
         console.log(param)
         if (param) {
           this.searchParam = param;
           this.countFilter();
           this.getJobTransactions();
         }
       }
     })
   }

   public onDetail(jobTransaction: JobTransaction) {
     const dialogConfig = new MatDialogConfig();
     dialogConfig.data = {'jobTransaction' : jobTransaction, 'picture': this.pictureMap.get(jobTransaction.id), 'isVendor': this.isVendor};
     dialogConfig.autoFocus = false;
     const dialogRef = this.dialog.open(OrderJobDetailComponent, dialogConfig);
   }
}
