import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

import { KeycloakAdminService } from './keycloak/keycloak-admin.js';
import {
  Gender,
  MaritalStatus,
  RelationshipStatus,
  User,
} from '@prisma/client';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly prisma: PrismaService,
  ) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        sentRequests: {
          where: {
            status: RelationshipStatus.Friends,
          },
          take: 6,
        },
      },
    });
  }

  async sentFriend(
    fromId: string,
    toId: string,
    status: RelationshipStatus,
    id?: number,
  ) {
    return this.prisma.relationship.upsert({
      where: {
        id,
        OR: [
          { userId1: fromId, userId2: toId },
          { userId1: toId, userId2: fromId },
        ],
      },
      create: {
        status,
        userId1: fromId,
        userId2: toId,
      },
      update: {
        status,
      },
    });
  }

  async getUserFriendsById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        sentRequests: {
          where: {
            status: RelationshipStatus.Friends,
          },
          include: {
            user1: {
              select: {
                id: true,
                username: true,
                firstName: true,
                secondName: true,
                gender: true,
                imageUrl: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  }

  async save(createUserDto: User) {
    if (await this.getUserById(createUserDto.id)) {
      throw new BadRequestException('User already exists!');
    }
    if (!(createUserDto.gender in Gender)) {
      throw new BadRequestException('Gender does not exists');
    }
    if (!(createUserDto.maritalStatus in MaritalStatus)) {
      throw new BadRequestException('MaritalStatus does not exists');
    }
    const user = _.omit(createUserDto, ['countryId']) as Omit<
      User,
      'countryId'
    >;
    try {
      return await this.prisma.user.create({
        data: {
          ...user,
          country: {
            connect: { id: createUserDto.countryId },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException('Wrong data');
    }
  }

  async syncWithKeycloak(id: string) {
    const user = await this.keycloak.getUserById(id);
    return {
      id,
      username: user.username,
      email: user.email,
    };
  }

  async getUsers() {
    return await this.keycloak.getUsers();
  }
}
