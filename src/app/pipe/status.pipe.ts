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

    return undefined;
  }

}
