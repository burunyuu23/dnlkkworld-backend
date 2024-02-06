import { Option, Questionnaire } from '@prisma/client';

export type CreateQuestionnaireDto = Pick<
  Questionnaire,
  'name' | 'question' | 'multiple'
> & {
  options: Pick<Option, 'text'>[];
};
