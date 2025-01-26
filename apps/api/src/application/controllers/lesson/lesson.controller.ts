import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { GenerateLessonDto } from './dto/generate-lesson.dto';

@ApiTags('Lesson')
@ApiBearerAuth()
@Controller('leasson')
export class LessonController {
  constructor(private service: LessonService) {}
  @Post()
  async generateLesson(@Body() data: GenerateLessonDto) {
    return this.service.generateLesson(data.theme);
  }
}
