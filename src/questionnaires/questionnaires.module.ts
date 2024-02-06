import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module.js';

import { QuestionnairesService } from './questionnaires.service.js';
import { QuestionnairesController } from './questionnaires.controller.js';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';

@Module({
  controllers: [QuestionnairesController],
  providers: [QuestionnairesService, KeycloakAdminService],
  imports: [PrismaModule],
})
export class QuestionnairesModule {}
