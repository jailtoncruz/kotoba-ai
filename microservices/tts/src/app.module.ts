import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { TTSProcessor } from './services/tts.processor';
import { BullModule } from '@nestjs/bullmq';

import { CloudModule, EnvironmentModule } from '@monorepo/shared';
import { LoggerModule } from '@monorepo/shared';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.register([
      {
        name: 'TTS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
          queue: 'tts_queue',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [TTSProcessor],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@Inject('TTS_SERVICE') private client: ClientProxy) {}

  onApplicationBootstrap() {
    this.client.connect();
  }
}
