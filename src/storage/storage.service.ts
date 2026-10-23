import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { envs } from '../config/envs';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: envs.AWS_REGION,
      credentials: {
        accessKeyId: envs.AWS_ACCESS_KEY_ID,
        secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
        sessionToken: envs.AWS_SESSION_TOKEN,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const prefix = folder.replace(/\/+$/, '');
    const extension = extname(file.originalname).toLowerCase();
    const key = `${prefix}/${Date.now()}-${randomUUID()}${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: envs.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${envs.AWS_BUCKET_NAME}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
  }
}
