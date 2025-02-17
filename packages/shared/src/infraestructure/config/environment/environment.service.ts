import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

type NodeEnvironemnt = 'production' | 'development' | 'test';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  getNodeEnvironment() {
    return this.configService.get('NODE_ENV') as NodeEnvironemnt;
  }

  isProduction(): boolean {
    return this.getNodeEnvironment() === 'production';
  }

  get(name: string): string | undefined {
    return this.configService.get(name);
  }

  getOrThrow(name: string): string {
    return this.configService.getOrThrow(name);
  }

  getGoogleCloudKeyPath() {
    return resolve(
      process.cwd(),
      'public',
      this.configService.getOrThrow('GCP_KEY_NAME'),
    );
  }

  getOpenAiApiKey() {
    return this.configService.getOrThrow('OPEN_AI_API_KEY');
  }
}
