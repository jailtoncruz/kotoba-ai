import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { CloudModule } from '../../../infraestructure/cloud/cloud.module';

@Module({
  imports: [CloudModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
