import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { RoomService } from './room.service.js';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { KeyCloakUserType } from '@/types.js';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly roomService: RoomService,
    private readonly chatSerivce: ChatService,
  ) {}

  @Get(':room')
  @Public()
  async getDialog(@Param('room', ParseIntPipe) roomId: number) {
    return await this.roomService.getRoomDialogById(roomId);
  }

  @Get()
  async getDialogs(@AuthenticatedUser() currentUser: KeyCloakUserType) {
    const user = this.keycloak.convertToBaseUser(currentUser);
    const dialogs = await this.roomService.getRoomDialogsByUser(user);
    return dialogs.map((dialog) => ({
      roomId: dialog.id,
      lastMessage: dialog.messages[0],
      notWatchedMessageCount: dialog._count.messages,
    }));
  }
}
