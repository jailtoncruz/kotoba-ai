import { Module } from '@nestjs/common';
import { PracticeSessionController } from './practice-session.controller';
import { PracticeSessionService } from './practice-session.service';

@Module({
  controllers: [PracticeSessionController],
  providers: [PracticeSessionService],
})
export class PracticeSessionModule {}
