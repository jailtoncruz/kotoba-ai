import { Provider } from '@nestjs/common';
import { EnvironmentService } from '../../config/environment/environment.service';
import { GcpSpeechToTextService } from './google-cloud/gcp-speech-to-text.service';
import { SpeechToTextService } from '../../../core/abstract/cloud/speech-to-text.service';

export const SpeechToTextServiceProvider: Provider = {
  provide: SpeechToTextService,
  useFactory: (environmentService: EnvironmentService) => {
    switch (environmentService.getNodeEnvironment()) {
      // case 'production':
      //   return new CloudFlareR2Service(environmentService);
      // case 'development':
      //   return new MinioService(environmentService);
      // case 'test':
      //   return new MockBucketService();
      default:
        return new GcpSpeechToTextService(environmentService);
    }
  },
  inject: [EnvironmentService],
};
