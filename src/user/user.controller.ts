import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';

import { UserService } from './user.service.js';
import { KeyCloakUserType } from '@/types.js';
import { CreateUserDto } from '@/user/dto/create-user.dto.js';
import { RelationshipStatus, User } from '@prisma/client';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly userService: UserService,
  ) {}

  @Get('/:id')
  @Public()
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }
    return user;
  }

  @Get('/:id/friends')
  @Public()
  async getUserFriends(@Param('id') id: string) {
    const user = await this.userService.getUserFriendsById(id);
    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }
    return user.sentRequests;
  }

  @Post('/:id/friend')
  @Public()
  async sentFriend(
    @AuthenticatedUser() currentUser: KeyCloakUserType,
    @Param('id') id: string,
    @Body() { status, relationId }: { status: string; relationId?: number },
  ) {
    if (!(status in RelationshipStatus)) {
      throw new BadRequestException('Неверный статус');
    }

    const user = this.keycloak.convertToBaseUser(currentUser);
    const sentRequest = await this.userService.sentFriend(
      user.id,
      id,
      status as RelationshipStatus,
      relationId,
    );
    if (!user) {
      throw new BadRequestException('Такого пользователя не существует');
    }
    return sentRequest.status;
  }

  @Post()
  async saveUser(
    @AuthenticatedUser() currentUser: KeyCloakUserType,
    @Body() createUserDto: CreateUserDto,
  ) {
    const curUser: User = {
      ...this.keycloak.convertToBaseUser(currentUser),
      ...createUserDto,
    };
    return await this.userService.save(curUser);
  }

  @Get()
  @Public()
  async getUsers() {
    return await this.userService.getUsers();
  }
}
