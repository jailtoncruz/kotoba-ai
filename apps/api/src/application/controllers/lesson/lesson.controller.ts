import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { GenerateLessonDto } from './dto/generate-lesson.dto';
import { AuthRequest } from 'src/core/domain/auth-request';

@ApiTags('Lesson')
@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
  constructor(private service: LessonService) {}

  @Get()
  async listLessonsByUserId(@Request() req: AuthRequest) {
    return this.service.listLessonsByUserId(req.user.userId);
  }

  @Get(':id')
  async getLessonById(@Param('id') id: string) {
    return this.service.getLessonById(id);
  }

  @Post()
  async generateLesson(
    @Body() data: GenerateLessonDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.generateLesson(data, req.user.userId);
  }

  @Delete(':id')
  async deleteLesson(@Param('id') id: string) {
    return this.service.deleteLesson(id);
  }
}
