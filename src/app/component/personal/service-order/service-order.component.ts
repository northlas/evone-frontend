import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { from, concatMap } from 'rxjs';
import { BasePageResponse } from 'src/app/model/base-page-response';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';
import { S3Service } from 'src/app/service/s3.service';
import { ServiceTransactionService } from 'src/app/service/service-transaction.service';
import { OrderServiceDetailComponent } from '../../dialog/order-service-detail/order-service-detail.component';
import { OrderFilterComponent } from '../../dialog/order-filter/order-filter.component';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/role.enum';

@Component({
  selector: 'app-service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.css']
})
export class ServiceOrderComponent implements OnInit{
  @ViewChild('input') searchField!: ElementRef;

  private isVendor!: boolean;
  private searchParam = {} as ServiceTransactionParam;
  public filterCount = 0;
  public page!: BasePageResponse<ServiceTransaction>;
  public pictureMap = new Map<string, SafeResourceUrl>();

  constructor(private serviceTransactionService: ServiceTransactionService, private s3Service: S3Service, private authService: AuthenticationService, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isVendor = this.authService.hasAuthority(Role.ROLE_VENDOR);
    this.searchParam.page = 1;
    this.getServiceTransactions();
  }

  private getServiceTransactions() {
    this.serviceTransactionService.getTransactionByUser(this.searchParam).subscribe({
      next: response => {
        this.page = response;
        response.items.forEach(value => {
          if (!this.pictureMap.has(value.id)) {
            this.getPictures(value.id, value.serviceOffer.pictures[0].id);
          }
        })
      }
    })
  }

  private getPictures(serviceTransactionId: string, pictureId: string) {
    from([pictureId])
    .pipe(concatMap(picture => this.s3Service.getImage('service offer/' + picture)))
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
    if(this.searchParam.category) count++;
    if(this.searchParam.startDt && this.searchParam.endDt) count++;
    if(this.searchParam.status) count++;
    this.filterCount = count;
  }

  public search(param: string) {
    if(param.length == 0) {
      const {title, ...param} = this.searchParam;
      this.searchParam = param as ServiceTransactionParam;
    }
    else this.searchParam.title = param;
    this.getServiceTransactions();
  }

  public onFilter() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {'serviceTransactionParam' : this.searchParam, 'isVendor': this.isVendor};
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(OrderFilterComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (param: ServiceTransactionParam | undefined) => {
        console.log(param)
        if (param) {
          this.searchParam = param;
          this.countFilter();
          this.getServiceTransactions();
        }
      }
    })
  }

  public onDetail(serviceTransaction: ServiceTransaction) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {'serviceTransaction' : serviceTransaction, 'picture': this.pictureMap.get(serviceTransaction.id), 'isVendor': this.isVendor};
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(OrderServiceDetailComponent, dialogConfig);
  }
}
