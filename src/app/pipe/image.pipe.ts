import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { S3Service } from '../service/s3.service';
import { catchError, defer, map, Observable, of, startWith } from 'rxjs';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private s3Service = inject(S3Service);

  transform(slugName: string, folder: string): Observable<any> {
    return defer(async () => {
      const prefix = () => {
        switch(folder) {
          case 'profile':
            return 'profile/'
          case 'service':
            return 'service offer/'
          default:
            return 'job offer/'
        }
      }
      const response = await this.s3Service.getImage(prefix() + slugName);
      return response.Body?.transformToByteArray().then(body => {
        let binary = '';
        for (let i = 0; i < body.length; i++) {
          binary += String.fromCharCode(body[i]);
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary));
      });
    }).pipe(
        map((value: any) => ({loading: false, value: value})),
        startWith({loading: true}),
        catchError(error => of({loading: false, error: error}))
    )
  }
}
