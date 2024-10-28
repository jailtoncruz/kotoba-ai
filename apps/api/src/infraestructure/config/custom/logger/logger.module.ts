import { DynamicModule, Global, Module } from '@nestjs/common';
import { ProductionLoggerService } from './production-logger.service';
import { DevelopmentLoggerService } from './development-logger.service';
import { PRODUCTION_MODE } from '../../environment/contants';
import { LoggerService } from '../../../../core/abstract/logger-service';

const LoggerServiceProvider = {
  provide: LoggerService,
  useClass: PRODUCTION_MODE
    ? ProductionLoggerService
    : DevelopmentLoggerService,
};

@Global()
@Module({
  providers: [LoggerServiceProvider],
  exports: [LoggerServiceProvider],
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
