import { Pipe, PipeTransform } from '@angular/core';
import { JobTransactionStatus } from '../enum/job-transaction-status';
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
      switch (value) {
        case JobTransactionStatus.ORDERED:
          return 'Menunggu Konfirmasi';
        case JobTransactionStatus.CONFIRMED:
          return 'Menunggu Pembayaran';
        case JobTransactionStatus.PAID:
          return 'Berlangsung';
        case JobTransactionStatus.FINISHED:
          return 'Selesai';
        case JobTransactionStatus.FAILED:
          return 'Dibatalkan';
      }
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
    else if (type == 'job-bg') {
      switch (value) {
        case JobTransactionStatus.ORDERED:
          return 'background-color: #82a5b6; color: white';
          case JobTransactionStatus.CONFIRMED:
          return 'background-color: #82a5b6; color: white';
        case JobTransactionStatus.PAID:
          return 'background-color: #82a5b6; color: white';
        case JobTransactionStatus.FINISHED:
          return 'background-color: #53cb77; color: white';
        case JobTransactionStatus.FAILED:
          return 'background-color: #ff5f37; color: white';
      }
    }

    return undefined;
  }

}
