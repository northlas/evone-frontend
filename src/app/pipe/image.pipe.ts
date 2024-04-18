import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Service } from '../service/s3.service';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private s3Service = inject(S3Service);

  async transform(slugName: string): Promise<SafeResourceUrl> {
    return new Promise(async resolve => {
      this.s3Service.getImage(slugName).then(response => {
        response.Body?.transformToByteArray().then(body => {
          let binary = '';
          for (let i = 0; i < body.length; i++) {
            binary += String.fromCharCode(body[i]);
          }
          resolve(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(binary)))
        })
      })
    })
  }

}
