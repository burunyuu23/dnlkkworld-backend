import { Module } from '@nestjs/common';

import { MusicService } from './music.service.js';
import { MusicController } from './music.controller.js';
import { MinioService } from '../minio/minio.service.js';

@Module({
  controllers: [MusicController],
  providers: [MusicService, MinioService],
})
export class MusicModule {}
