import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private s3Client = new S3Client({
    region: 'apac',
    bucketEndpoint: true,
    credentials: {
      accessKeyId: 'bcca4cf5523a07e5525bfb1c24d77559',
      secretAccessKey: '054688e8923584e48ffd40d2ee615a026aa750d7dcd398c12fa5615ba67f3579'
    }
  })

  async transform(base64: string): Promise<SafeResourceUrl> {
    const getObjectRequest = new GetObjectCommand({
      Bucket: 'https://b9d00b840e6390b267db3210d764922d.r2.cloudflarestorage.com/evone',
      Key: 'vendor/jeon-jk-1.jpg',
      ResponseContentType: 'image/jpeg',
    })

    return new Promise(async resolve => {
      this.s3Client.send(getObjectRequest).then(response => {
        response.Body?.transformToByteArray().then(body => {
          resolve(this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + btoa(String.fromCharCode(...body))))
        })
      })
    })
  }

}
