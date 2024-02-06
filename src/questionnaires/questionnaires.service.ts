import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service.js';

import {
  CreateQuestionnaireDto,
  UpdateQuestionnaireDto,
  VoteDto,
} from './dto/index.js';
import { Prisma, User } from '@prisma/client';
import { BaseUser } from '@/types.js';

@Injectable()
export class QuestionnairesService {
  constructor(private prisma: PrismaService) {}

  async create(user: BaseUser, createQuestionnaireDto: CreateQuestionnaireDto) {
    return this.prisma.questionnaire.create({
      data: {
        ...createQuestionnaireDto,
        author: {
          connect: {
            id: user.id,
          },
        },
        options: {
          createMany: {
            data: createQuestionnaireDto.options,
          },
        },
      },
    });
  }

  async vote(id: number, user: BaseUser, voteDto: VoteDto) {
    const quest = await this.prisma.questionnaire
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          answered: true,
          options: true,
        },
      })
      .then((resp) => resp)
      .catch(() => {
        throw new NotFoundException('Questionnaire not found!');
      });
    if (voteDto.options.length === 0) {
      throw new BadRequestException('Unacceptable zero choice!');
    }
    if (
      quest.answered.findIndex(
        (answeredUser: User) => answeredUser.id === user.id,
      ) !== -1
    ) {
      throw new ForbiddenException('Questionnaire has already answered!');
    }
    if (!quest.multiple && voteDto.options.length > 1) {
      throw new BadRequestException('Unacceptable multiple choice!');
    }

    const qOptionsId = quest.options.map((option) => option.id);
    if (!voteDto.options.every((v) => qOptionsId.includes(v))) {
      throw new BadRequestException(
        `Some options are not contained by questionnaire with id=${id}`,
      );
    }

    try {
      await this.prisma.choice.createMany({
        data: voteDto.options.map((optionId) => ({
          userId: user.id,
          optionId,
        })),
      });
      console.log(user.id);
      await this.prisma.questionnaire.update({
        where: { id },
        data: {
          answered: {
            connect: { id: user.id },
          },
          answeredCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('User or Option does not exists!');
      } else {
        console.error('Произошла ошибка:', error);
      }
    }
  }

  async findAll() {
    return this.prisma.questionnaire.findMany({
      include: {
        author: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.questionnaire.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  update(id: number, updateQuestionnaireDto: UpdateQuestionnaireDto) {
    return `This action updates a #${id} questionnaire`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionnaire`;
  }
}
