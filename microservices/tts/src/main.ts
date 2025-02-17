import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EnvironmentService } from '@monorepo/shared';

async function bootstrap() {
  const base = await NestFactory.createApplicationContext(AppModule);
  const env = base.get(EnvironmentService);
  const natsServer = env.get('NATS_SERVER') ?? 'nats://localhost:4222';

  console.log('---', natsServer);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsServer],
        queue: 'tts_queue',
      },
    },
  );

  await app.listen();
}
bootstrap();
