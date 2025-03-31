import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ListenerController } from './listener.controller';
import { DatabaseModule } from 'src/infraestructure/database/database.module';
import {
  EnvironmentModule,
  EnvironmentService,
  LoggerModule,
} from '@monorepo/shared';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot(),
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
  controllers: [ListenerController],
})
export class MicroservicesModule {}
