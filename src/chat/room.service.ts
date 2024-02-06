import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import { BaseUser } from '@/types.js';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async getRoomDialogsByUser(user: BaseUser) {
    return this.prisma.room.findMany({
      where: {
        participants: {
          some: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        messages: {
          orderBy: {
            sendAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                watched: false,
              },
            },
          },
        },
      },
    });
  }

  async getRoomDialogById(id: number) {
    return this.prisma.room.findUnique({
      where: {
        id,
      },
      select: {
        messages: {
          orderBy: {
            id: 'asc',
          },
        },
        participants: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async readAllMyMessagesInRoom(roomId: number, userId) {
    try {
      const resp = await this.prisma.message.updateMany({
        where: {
          roomId,
          toUserId: userId,
          watched: false,
        },
        data: {
          watched: true,
        },
      });
      console.log(resp);
    } catch (e) {
      console.log(e);
    }
  }

  async getRoomNotWatchedCount(userId, roomId) {
    return this.prisma.room.findUnique({
      where: {
        id: roomId,
        participants: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        _count: {
          select: {
            messages: {
              where: {
                watched: false,
              },
            },
          },
        },
      },
    })['_count'].messages;
  }
}
