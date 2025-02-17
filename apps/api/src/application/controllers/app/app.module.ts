import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ControllerModule } from '../controller.module';
import { EnvironmentModule } from '../../../infraestructure/config/environment/environment.module';
import { SwaggerService } from '../../../infraestructure/config/swagger/swagger.service';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from '@monorepo/shared';
import { EnvironmentService } from 'src/infraestructure/config/environment/environment.service';
import { PRODUCTION_MODE } from 'src/infraestructure/config/environment/contants';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), 'apps', 'client', 'dist'),
    }),
    ControllerModule,
    LoggerModule.forRoot(),
    EnvironmentModule.forRoot(),
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
  ],
  providers: [SwaggerService],
})
export class AppModule {}
