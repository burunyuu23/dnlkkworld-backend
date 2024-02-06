import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';

import { KeyCloakUserType } from '@/types.js';

import { QuestionnairesService } from './questionnaires.service.js';
import {
  CreateQuestionnaireDto,
  UpdateQuestionnaireDto,
  VoteDto,
} from './dto/index.js';
import { KeycloakAdminService } from '@/user/keycloak/keycloak-admin.js';

@Controller('questionnaires')
export class QuestionnairesController {
  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly questionnairesService: QuestionnairesService,
  ) {}

  @Get()
  findAll() {
    return this.questionnairesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionnairesService.findOne(id);
  }

  @Post()
  create(
    @AuthenticatedUser() user: KeyCloakUserType,
    @Body() createQuestionnaireDto: CreateQuestionnaireDto,
  ) {
    return this.questionnairesService.create(
      this.keycloak.convertToBaseUser(user),
      createQuestionnaireDto,
    );
  }

  @Post(':id')
  async vote(
    @AuthenticatedUser() user: KeyCloakUserType,
    @Param('id', ParseIntPipe) id: number,
    @Body() voteDto: VoteDto,
  ) {
    return await this.questionnairesService.vote(
      id,
      this.keycloak.convertToBaseUser(user),
      voteDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    return this.questionnairesService.update(+id, updateQuestionnaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionnairesService.remove(+id);
  }
}
