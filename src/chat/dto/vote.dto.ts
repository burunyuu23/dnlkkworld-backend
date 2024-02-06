import { Option } from '@prisma/client';

export type VoteDto = {
  options: Option['id'][];
};
