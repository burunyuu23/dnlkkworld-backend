import {BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors,} from '@nestjs/common';
import {env} from 'process';
import {FileInterceptor} from '@nestjs/platform-express';

import {ImageService} from './image.service.js';
import {MinioService} from '../minio/minio.service.js';
import {AuthenticatedUser} from 'nest-keycloak-connect';
import {KeyCloakUserType} from '@/types.js';
import {KeycloakAdminService} from '@/user/keycloak/keycloak-admin.js';

@Controller('image')
export class ImageController {
  private readonly imageBucket = env.MINIO_IMAGE_BUCKET;

  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly minioService: MinioService,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; description: string },
    @AuthenticatedUser() currentUser: KeyCloakUserType,
  ) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('И картинка не картинка');
    }
    const user = this.keycloak.convertToBaseUser(currentUser);
    const imageUrl = await this.minioService.uploadFile(this.imageBucket, file);
    await this.imageService.createImage(user, imageUrl, body);
  }

  @Post('banner')
  async setUserBanner(
    @Body(ParseIntPipe) body: { id: number },
    @AuthenticatedUser() currentUser: KeyCloakUserType,
  ) {
    const user = this.keycloak.convertToBaseUser(currentUser);
    await this.imageService.setUserBanner(body.id, user);
  }

  @Post('avatar')
  async setUserAvatar(
    @Body(ParseIntPipe) body: { id: number },
    @AuthenticatedUser() currentUser: KeyCloakUserType,
  ) {
    const user = this.keycloak.convertToBaseUser(currentUser);
    await this.imageService.setUserAvatar(body.id, user);
  }

  @Get(':fileName')
  async getBookCover(@Param('fileName') fileName: string) {
    return await this.minioService.getFileUrl(this.imageBucket, fileName);
  }
}
