import { Module } from '@nestjs/common';
import { CloudModule } from '../../../infraestructure/cloud/cloud.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [CloudModule],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
