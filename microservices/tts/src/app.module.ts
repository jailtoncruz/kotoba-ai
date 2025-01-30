import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TTSProcessor } from './services/tts.processor';
import { BullModule } from '@nestjs/bullmq';

import { CloudModule, EnvironmentModule } from '@monorepo/shared';
import { LoggerModule } from '@monorepo/shared';

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

    LoggerModule.forRoot(),
    CloudModule,
    EnvironmentModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [TTSProcessor],
})
export class AppModule {}
