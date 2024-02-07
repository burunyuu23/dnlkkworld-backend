import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { env } from 'process';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ROOT_USER'),
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD'),
    });
  }

  async uploadFile(bucketName: string, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    if (file.size > 8 * 1024 * 1024) {
      throw new PayloadTooLargeException('Охладите ваши файлы. Макс 20МБ!!!');
    }
    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );
    return env.MINIO_URL + `${bucketName}/${fileName}`;
  }

  async getFileUrl(bucketName: string, fileName: string) {
    return await this.minioClient.presignedUrl('GET', bucketName, fileName);
  }
}
