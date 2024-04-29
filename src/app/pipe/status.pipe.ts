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
        case ServiceTransactionStatus.EXPIRED:
          return 'Dibatalkan';
        case ServiceTransactionStatus.PAID:
          return 'Menunggu Konfirmasi Vendor';
        case ServiceTransactionStatus.CONFIRMED:
          return 'Sedang Berjalan';
        case ServiceTransactionStatus.DONE:
          return 'Selesai';
        case ServiceTransactionStatus.CANCELLED:
          return undefined;
      }
    }
    else if (type == 'job') {
      return '';
    }

    return undefined;
  }

}
