import { Body, Controller, Param, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { GenerateCardDto } from './dto/generate-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('cards')
@ApiTags('Card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('generate')
  async generateCards(@Body() data: GenerateCardDto) {
    const generatedCards = await this.cardService.generateFlashcards(data);
    return { generatedCards, size: generatedCards.length };
  }

  @Post('explain/:card_id')
  async explain(@Param('card_id') card_id: string) {
    const explanation = await this.cardService.explain(card_id);
    return { explanation };
  }
}
