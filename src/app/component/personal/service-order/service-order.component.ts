import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { from, concatMap } from 'rxjs';
import { BasePageResponse } from 'src/app/model/base-page-response';
import { ServiceTransaction } from 'src/app/model/service-transaction';
import { ServiceTransactionParam } from 'src/app/model/service-transaction-param ';
import { S3Service } from 'src/app/service/s3.service';
import { ServiceTransactionService } from 'src/app/service/service-transaction.service';
import { OrderServiceDetailComponent } from '../../dialog/order-service-detail/order-service-detail.component';

@Component({
  selector: 'app-service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.css']
})
export class ServiceOrderComponent implements OnInit{
  public page!: BasePageResponse<ServiceTransaction>;
  private param = {} as ServiceTransactionParam;
  public pictureMap = new Map<string, SafeResourceUrl>();

  constructor(private serviceTransactionService: ServiceTransactionService, private s3Service: S3Service, private sanitizer: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.param.page = 1;
    this.getServiceTransactions();
  }

  private getServiceTransactions() {
    this.serviceTransactionService.getTransactionByUser(this.param).subscribe({
      next: response => {
        this.page = response;
        response.items.forEach(value => {
          this.getPictures(value.id, value.serviceOffer.pictures[0].id);
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

  public onDetail(serviceTransaction: ServiceTransaction) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {'serviceTransaction' : serviceTransaction, 'picture': this.pictureMap.get(serviceTransaction.id)};
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(OrderServiceDetailComponent, dialogConfig);
  }
}
