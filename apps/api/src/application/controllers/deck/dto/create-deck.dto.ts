import { ApiProperty } from '@nestjs/swagger';

export abstract class CreateDeckDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  language: string;
}
