import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

import { KeycloakAdminService } from './keycloak/keycloak-admin.js';
import { Gender, MaritalStatus, User } from '@prisma/client';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly prisma: PrismaService,
  ) {}

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
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
