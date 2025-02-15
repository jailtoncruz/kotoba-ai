import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export abstract class ReviewCardDto {
  @ApiProperty({
    minimum: 0,
    maximum: 3,
  })
  @IsNumber()
  @Min(0)
  @Max(3)
  rating: number;
}
