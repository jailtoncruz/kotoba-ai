import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export abstract class GenerateCardDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  complexity: number;

  @ApiProperty({
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  context?: string;
}
