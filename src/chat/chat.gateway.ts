import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Message } from '@prisma/client';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';
import { ChatService } from './chat.service.js';
import { CreateMessageDto } from './dto/index.js';
import { RoomService } from './room.service.js';

const allClients = new Map<string, Socket>();

const logClients = () => {
  console.log(
    Array.from(allClients.entries()).map(([key, client]) => ({
      data: client.data,
      id: client.id,
      key,
    })),
  );
};

const removeClient = (socket: Socket) => {
  allClients.delete(socket.data.userId);
};

const pushClient = (socket: Socket, userId: string) => {
  const client = allClients.get(userId);
  if (!client && !socket.data.userId) {
    socket.data.userId = userId;
    allClients.set(userId, socket);
  } else {
    client.emit('error', { error: 401, message: 'Socket already exists.' });
  }
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('login')
  async handleLoginEvent(
    client: Socket,
    data: {
      accessToken: string;
    },
  ) {
    console.log(data);
    try {
      const userId = await this.keycloak.getCurrentUserId(data.accessToken);
      pushClient(client, userId);
      logClients();
    } catch (e) {
      client.emit('error', { error: 401, message: 'Invalid credentials.' });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessageEvent(
    socket: Socket,
    data: {
      createMessageDto: CreateMessageDto;
    },
  ) {
    const message = data.createMessageDto as Message;
    const client = allClients.get(data.createMessageDto.toUserId);
    message.watched =
      !!client && client.rooms.has(`${data.createMessageDto.roomId}`); // Переделать с Boolean и User[]
    const newMessage = await this.chatService.addMessage(message);

    const resp = {
      message: newMessage,
      notWatchedMessageCount: await this.roomService.getRoomNotWatchedCount(
        socket.data.userId,
        message.roomId,
      ),
    };
    this.server.to(`${message.roomId}`).emit('message', resp);

    if (!newMessage.watched) {
      if (!client) {
        client.emit('message', resp);
      }
    }
  }

  @SubscribeMessage('join')
  async handleSetClientDataEvent(
    client: Socket,
    data: {
      roomId: number;
      accessToken: string;
    },
  ) {
    try {
      const userId = await this.keycloak.getCurrentUserId(data.accessToken);
      if (client.data.userId !== userId) {
        throw new Error('Another account');
      }
      await this.roomService.readAllMyMessagesInRoom(data.roomId, userId);
      client.join(`${data.roomId}`);
      this.server
        .to(`${data.roomId}`)
        .emit('inDialog', { userId, inDialog: true });
    } catch (e) {
      client.emit('error', { error: 401, message: 'Invalid credentials.' });
    }
  }

  @SubscribeMessage('leave')
  async handleLeaveEvent(
    client: Socket,
    data: {
      roomId: number;
      accessToken: string;
    },
  ) {
    try {
      const userId = await this.keycloak.getCurrentUserId(data.accessToken);
      if (client.data.userId !== userId) {
        throw new Error('Another account');
      }
      client.leave(`${data.roomId}`);
      this.server
        .to(`${data.roomId}`)
        .emit('inDialog', { userId, inDialog: false });
    } catch (e) {
      client.emit('error', { error: 401, message: 'Invalid credentials.' });
    }
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    removeClient(socket);
    logClients();
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
