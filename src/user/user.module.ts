import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module.js';

import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';

@Module({
  providers: [UserService, KeycloakAdminService],
  controllers: [UserController],
  imports: [PrismaModule],
})
export class UserModule {}
