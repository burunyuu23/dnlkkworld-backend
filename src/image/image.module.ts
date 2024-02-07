import { Module } from '@nestjs/common';

import { ImageService } from './image.service.js';
import { ImageController } from './image.controller.js';
import { MinioService } from '../minio/minio.service.js';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';

@Module({
  controllers: [ImageController],
  providers: [ImageService, MinioService, KeycloakAdminService],
  imports: [PrismaModule],
})
export class ImageModule {}
