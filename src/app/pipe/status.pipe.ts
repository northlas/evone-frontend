import { Pipe, PipeTransform } from '@angular/core';
import { ServiceTransactionStatus } from '../enum/service-transaction-status';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number, type: string): string | undefined {
    if (type == 'service') {
      switch (value) {
        case ServiceTransactionStatus.ORDERED:
          return 'Menunggu Pembayaran';
        case ServiceTransactionStatus.PAID:
          return 'Menunggu Konfirmasi';
        case ServiceTransactionStatus.CONFIRMED:
          return 'Berlangsung';
        case ServiceTransactionStatus.FINISHED:
          return 'Selesai';
        case ServiceTransactionStatus.FAILED:
          return 'Dibatalkan';
      }
    }
    else if (type == 'job') {
      return '';
    }
    else if (type == 'service-bg') {
      switch (value) {
        case ServiceTransactionStatus.ORDERED:
          return 'background-color: #82a5b6; color: white';
        case ServiceTransactionStatus.PAID:
          return 'background-color: #82a5b6; color: white';
        case ServiceTransactionStatus.CONFIRMED:
          return 'background-color: #ffa00c; color: white';
        case ServiceTransactionStatus.FINISHED:
          return 'background-color: #53cb77; color: white';
        case ServiceTransactionStatus.FAILED:
          return 'background-color: #ff5f37; color: white';
      }
    }

    return undefined;
  }

}
