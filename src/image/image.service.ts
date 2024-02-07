import {Injectable} from '@nestjs/common';
import {BaseUser} from '@/types.js';
import {PrismaService} from '@/prisma/prisma.service.js';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async setUserBanner(id: number, user: BaseUser) {
    this.prisma.media.update({
      where: {
        id,
      },
      data: {
        userBanner: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async setUserAvatar(id: number, user: BaseUser) {
    this.prisma.media.update({
      where: {
        id,
      },
      data: {
        userAvatar: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async createImage(
    user: BaseUser,
    url: string,
    body: { name: string; description: string },
  ) {
    this.prisma.media.create({
      data: {
        name: body.name,
        description: body.description,
        url,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
