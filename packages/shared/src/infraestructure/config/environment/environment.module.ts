import { DynamicModule, Global, Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

@Global()
@Module({
  providers: [EnvironmentService],
  exports: [EnvironmentService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(process.cwd(), '.env'),
    }),
  ],
})
export class EnvironmentModule {
  static forRoot(): DynamicModule {
    return {
      module: EnvironmentModule,
      exports: [EnvironmentService],
      providers: [EnvironmentService],
    };
  }
}
