import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { ProductionLoggerService } from './production-logger.service';
import { DevelopmentLoggerService } from './development-logger.service';
import { LoggerService } from '../../core/abstract/logger-service';
import { PRODUCTION_MODE } from '../config/environment/contants';

const LoggerServiceProvider = {
  provide: LoggerService,
  useClass: PRODUCTION_MODE
    ? ProductionLoggerService
    : DevelopmentLoggerService,
};

@Global()
@Module({
  providers: [LoggerServiceProvider, Logger],
  exports: [LoggerServiceProvider, Logger],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [LoggerServiceProvider],
      exports: [LoggerServiceProvider],
    };
  }
}
