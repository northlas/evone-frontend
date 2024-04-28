import { Pipe, PipeTransform } from '@angular/core';
import { ServiecTransactionStatus } from '../enum/header-type.enum copy';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: number, type: string): string | undefined {
    if (type == 'service') {
      switch (value) {
        case ServiecTransactionStatus.ORDERED:
          return 'Menunggu Pembayaran';
        case ServiecTransactionStatus.PAID:
          return 'Menunggu Konfirmasi Vendor';
        case ServiecTransactionStatus.CONFIRMED:
          return 'Sedang Berjalan';
        case ServiecTransactionStatus.DONE:
          return 'Selesai';
        case ServiecTransactionStatus.CANCELLED:
          return undefined;
      }
    }
    else if (type == 'job') {
      return '';
    }

    return undefined;
  }

}
