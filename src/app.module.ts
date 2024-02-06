import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { QuestionnairesModule } from './questionnaires/questionnaires.module.js';
import { UserModule } from './user/user.module.js';
import { ChatModule } from './chat/chat.module.js';
import { CoreModule } from './CoreModule.js';

const NODE_ENV = env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error('Не задана переменная окружения NODE_ENV');
}

@Module({
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${NODE_ENV}`, '.env'],
      expandVariables: true,
    }),
    QuestionnairesModule,
    UserModule,
    ChatModule,
    CoreModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
