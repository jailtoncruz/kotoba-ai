import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ControllerModule } from '../controller.module';
import { EnvironmentModule } from '../../../infraestructure/config/environment/environment.module';
import { SwaggerService } from '../../../infraestructure/config/swagger/swagger.service';
import { LoggerModule } from '../../../infraestructure/logger/logger.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), '..', 'client', 'dist'),
    }),
    ControllerModule,
    EnvironmentModule.forRoot(),
    LoggerModule.forRoot(),
  ],
  providers: [SwaggerService],
})
export class AppModule {}
