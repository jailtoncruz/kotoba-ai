import { Provider } from '@nestjs/common';
import { EnvironmentService } from '../../config/environment/environment.service';
import { GcpTextToSpeechService } from './google-cloud/gcp-text-to-speech.service';
import { TextToSpeechService } from '../../../core/abstract/cloud/text-to-speech.service';

export const TextToSpeechServiceProvider: Provider = {
  provide: TextToSpeechService,
  useFactory: (environmentService: EnvironmentService) => {
    switch (environmentService.getNodeEnvironment()) {
      // case 'production':
      //   return new CloudFlareR2Service(environmentService);
      // case 'development':
      //   return new MinioService(environmentService);
      // case 'test':
      //   return new MockBucketService();
      default:
        return new GcpTextToSpeechService(environmentService);
    }
  },
  inject: [EnvironmentService],
};
