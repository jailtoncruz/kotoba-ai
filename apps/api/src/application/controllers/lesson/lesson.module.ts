import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { CloudModule } from '../../../infraestructure/cloud/cloud.module';
import { FileService } from '../../../infraestructure/config/file/file.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    CloudModule,
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

    BullModule.registerQueue({
      name: 'tts',
    }),
  ],
  controllers: [LessonController],
  providers: [LessonService, FileService],
})
export class LessonModule implements OnApplicationBootstrap {
  constructor(@Inject('TTS_SERVICE') private client: ClientProxy) {}

  onApplicationBootstrap() {
    this.client.connect();
  }
}
