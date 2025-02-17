import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { TTSProcessor } from './services/tts.processor';
import { BullModule } from '@nestjs/bullmq';

import {
  CloudModule,
  EnvironmentModule,
  EnvironmentService,
} from '@monorepo/shared';
import { LoggerModule } from '@monorepo/shared';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (env: EnvironmentService) => ({
        connection: {
          host: env.get('REDIS_HOST') ?? 'localhost',
          port: Number(env.get('REDIS_PORT') ?? 6379),
          username: env.get('REDIS_USERNAME'),
          password: env.get('REDIS_PASSWORD'),
        },
      }),
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
    }),
    BullModule.registerQueue({
      name: 'tts',
    }),
    LoggerModule.forRoot(),
    CloudModule,
    EnvironmentModule.forRoot(),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'TTS_SERVICE',
          useFactory: (env: EnvironmentService) => ({
            transport: Transport.NATS,
            options: {
              servers: [env.get('NATS_SERVER') ?? 'nats://localhost:4222'],
              queue: 'tts_queue',
            },
          }),
          imports: [EnvironmentModule],
          inject: [EnvironmentService],
        },
      ],
    }),
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
