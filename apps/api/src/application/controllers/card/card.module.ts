import { Module } from '@nestjs/common';
import { CloudModule } from '../../../infraestructure/cloud/cloud.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    CloudModule,
    BullModule.registerQueue({
      name: 'tts',
    }),
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
