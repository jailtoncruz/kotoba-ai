import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ListenerController } from './listener.controller';
import { DatabaseModule } from 'src/infraestructure/database/database.module';
import { LoggerModule } from '@monorepo/shared';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot(),
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
  controllers: [ListenerController],
})
export class MicroservicesModule {}
