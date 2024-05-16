import { Injectable } from '@angular/core';
import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private s3Client = new S3Client({
    region: 'apac',
    bucketEndpoint: true,
    credentials: {
      accessKeyId: 'bcca4cf5523a07e5525bfb1c24d77559',
      secretAccessKey: '054688e8923584e48ffd40d2ee615a026aa750d7dcd398c12fa5615ba67f3579'
    }
  })

  constructor() { }

  public getImage(key: string): Promise<GetObjectCommandOutput> {
    const getObjectRequest = new GetObjectCommand({
      Bucket: 'https://b9d00b840e6390b267db3210d764922d.r2.cloudflarestorage.com/evone',
      Key: `${key}.jpg`,
      ResponseContentType: 'image/jpeg',
    })

    return this.s3Client.send(getObjectRequest);
  }
}
