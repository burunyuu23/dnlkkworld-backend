import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway.js';
import { CoreModule } from '../CoreModule.js';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';
import { ChatService } from './chat.service.js';
import { RoomService } from './room.service.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { ChatController } from './chat.controller.js';

@Module({
  imports: [CoreModule],
  providers: [
    ChatGateway,
    KeycloakAdminService,
    PrismaService,
    ChatService,
    RoomService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
