import { Media, Message } from '@prisma/client';

export type CreateMessageDto = Pick<
  Message,
  'toUserId' | 'fromUserId' | 'text'
> &
  Partial<Pick<Message, 'roomId' | 'voiceMessageUrl'>> & {
    media?: Media['id'][];
  };
