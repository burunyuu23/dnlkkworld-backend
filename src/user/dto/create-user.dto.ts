import { User } from '@prisma/client';

export type CreateUserDto = Omit<User, 'id' | 'username' | 'email'>;
