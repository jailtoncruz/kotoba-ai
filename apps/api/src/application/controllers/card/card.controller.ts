import { Body, Controller, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { GenerateCardDto } from './dto/generate-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('cards')
@ApiTags('Card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('generate')
  async generateCards(@Body() { complexity }: GenerateCardDto) {
    // Use the cardService to generate flashcards
    const generatedCards =
      await this.cardService.generateFlashcards(complexity);
    return { generatedCards };
  }
}
