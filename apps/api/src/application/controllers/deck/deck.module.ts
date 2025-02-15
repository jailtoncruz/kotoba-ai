import { Module } from '@nestjs/common';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';

@Module({
  imports: [],
  controllers: [DeckController],
  providers: [DeckService],
})
export class DeckModule {}
