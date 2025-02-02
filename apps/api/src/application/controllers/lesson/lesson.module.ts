import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { CloudModule } from '../../../infraestructure/cloud/cloud.module';
import { FileService } from '../../../infraestructure/config/file/file.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    CloudModule,
    BullModule.registerQueue({
      name: 'tts',
    }),
  ],
  controllers: [LessonController],
  providers: [LessonService, FileService],
})
export class LessonModule {}
