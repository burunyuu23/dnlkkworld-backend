import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { env } from 'process';

import { MusicService } from './music.service.js';
import { MinioService } from '../minio/minio.service.js';

@Controller('music')
export class MusicController {
  private readonly musicBucket = env.MINIO_MUSIC_BUCKET;

  constructor(
    private readonly minioService: MinioService,
    private readonly musicService: MusicService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file.mimetype);
    if (!file.mimetype.startsWith('audio/')) {
      throw new BadRequestException('И музыка не музыка');
    }
    return await this.minioService.uploadFile(this.musicBucket, file);
  }

  @Get(':fileName')
  async getBookCover(@Param('fileName') fileName: string) {
    return await this.minioService.getFileUrl(this.musicBucket, fileName);
  }
}
