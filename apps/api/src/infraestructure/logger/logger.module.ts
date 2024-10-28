import { DynamicModule, Global, Logger, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      exports: [Logger],
      providers: [Logger],
    };
  }
}
