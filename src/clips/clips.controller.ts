import { Controller } from '@nestjs/common';

import { ClipsService } from './clips.service.js';

@Controller('clips')
export class ClipsController {
  constructor(private readonly clipsService: ClipsService) {}
}
