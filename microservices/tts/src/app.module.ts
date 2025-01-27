import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TTSConsumer } from './consumer/tts.consumer';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'tts',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TTSConsumer],
})
export class AppModule {}
