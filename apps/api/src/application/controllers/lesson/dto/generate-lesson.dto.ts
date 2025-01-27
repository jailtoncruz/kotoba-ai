import { ApiProperty } from '@nestjs/swagger';

export abstract class GenerateLessonDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    example: 'Japanese particles',
  })
  subject: string;

  @ApiProperty({ required: false })
  observations?: string;
}
