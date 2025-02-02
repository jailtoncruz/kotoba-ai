import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { GenerateLessonDto } from './dto/generate-lesson.dto';
import { AuthRequest } from 'src/core/domain/auth-request';

@ApiTags('Lesson')
@ApiBearerAuth()
@Controller('leasson')
export class LessonController {
  constructor(private service: LessonService) {}
  @Post()
  async generateLesson(
    @Body() data: GenerateLessonDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.generateLesson(data, req.user.userId);
  }
}
