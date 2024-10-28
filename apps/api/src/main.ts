import { NestFactory } from '@nestjs/core';
import { SwaggerService } from './infraestructure/config/swagger/swagger.service';
import { EnvironmentService } from './infraestructure/config/environment/environment.service';
import { AppModule } from './application/controllers/app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environmentService = app.get(EnvironmentService);
  app.setGlobalPrefix('api');
  app.get(SwaggerService).init(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });
  await app.listen(environmentService.getServerPort());
}
bootstrap();
