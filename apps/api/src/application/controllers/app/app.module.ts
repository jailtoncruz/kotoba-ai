import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ControllerModule } from '../controller.module';
import { EnvironmentModule } from '../../../infraestructure/config/environment/environment.module';
import { SwaggerService } from '../../../infraestructure/config/swagger/swagger.service';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from '@monorepo/shared';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve('apps', 'client', 'dist'),
    }),
    ControllerModule,
    LoggerModule.forRoot(),
    EnvironmentModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [SwaggerService],
})
export class AppModule {}
