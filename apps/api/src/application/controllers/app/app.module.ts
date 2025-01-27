import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ControllerModule } from '../controller.module';
import { EnvironmentModule } from '../../../infraestructure/config/environment/environment.module';
import { SwaggerService } from '../../../infraestructure/config/swagger/swagger.service';
import { LoggerModule } from '../../../infraestructure/logger/logger.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), '..', 'client', 'dist'),
    }),
    ControllerModule,
    EnvironmentModule.forRoot(),
    LoggerModule.forRoot(),

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
