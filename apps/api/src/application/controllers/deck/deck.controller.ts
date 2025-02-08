import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/core/domain/auth-request';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './dto/create-deck.dto';

@ApiBearerAuth()
@ApiTags('Deck')
@Controller('deck')
export class DeckController {
  constructor(private service: DeckService) {}

  @Get()
  list(@Request() req: AuthRequest) {
    return this.service.listDecksByUserId(req.user.userId);
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateDeckDto) {
    return this.service.createDeck({
      name: dto.name,
      language: dto.language,
      userId: req.user.userId,
    });
  }
}
