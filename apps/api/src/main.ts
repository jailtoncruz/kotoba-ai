import { NestFactory } from '@nestjs/core';
import { SwaggerService } from './infraestructure/config/swagger/swagger.service';
import { EnvironmentService } from './infraestructure/config/environment/environment.service';
import { AppModule } from './application/controllers/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroservicesModule } from './application/microservices/microservices.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environmentService = app.get(EnvironmentService);
  const natsServer =
    environmentService.get('NATS_SERVER') ?? 'nats://localhost:4222';

  console.log('---', natsServer);

  app.setGlobalPrefix('api');
  app.get(SwaggerService).init(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });
  await app.listen(environmentService.getServerPort());

  const microservices =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      MicroservicesModule,
      {
        transport: Transport.NATS,
        options: {
          servers: [natsServer],
          queue: 'tts_queue',
        },
      },
    );
  await microservices.listen();
}
bootstrap();
