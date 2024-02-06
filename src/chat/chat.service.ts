import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import { Message } from '@prisma/client';
import { CreateMessageDto } from '@/chat/dto/index.js';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async addMessage(sendMessage: Message & CreateMessageDto) {
    try {
      console.log(sendMessage);
      const message = await this.prisma.message.create({
        data: {
          text: sendMessage.text,
          watched: sendMessage.watched,
          room: {
            connectOrCreate: {
              where: {
                id: sendMessage.roomId,
              },
              create: {
                participants: {
                  connect: [
                    { id: sendMessage.fromUserId },
                    { id: sendMessage.toUserId },
                  ], //  Создание только если это лс, если это группа, то она
                  // точно создана заранее
                },
              },
            },
          },
          toUser: {
            connect: {
              id: sendMessage.toUserId,
            },
          },
          fromUser: {
            connect: {
              id: sendMessage.fromUserId,
            },
          },
        },
      });
      console.log(message);
      return message;
    } catch (e) {
      console.log(e);
    }
  }
}
