import { Module } from '@nestjs/common';

import { ClipsService } from './clips.service.js';
import { ClipsController } from './clips.controller.js';

@Module({
  controllers: [ClipsController],
  providers: [ClipsService],
})
export class ClipsModule {}
