import { ApiProperty } from '@nestjs/swagger';

export abstract class GenerateLessonDto {
  @ApiProperty({
    example: 'Japanese particles',
  })
  theme: string;
}
