import { Provider } from '@nestjs/common';
import { EnvironmentService } from '../../config/environment/environment.service';
import { OpenAIChatGptService } from './open-ai/gpt.service';
import { AiChatService } from '../../../core/abstract/cloud/ai-chat.service';

export const AiChatServiceProvider: Provider = {
  provide: AiChatService,
  useFactory: (environmentService: EnvironmentService) => {
    switch (environmentService.getNodeEnvironment()) {
      // case 'production':
      //   return new CloudFlareR2Service(environmentService);
      // case 'development':
      //   return new MinioService(environmentService);
      // case 'test':
      //   return new MockBucketService();
      default:
        return new OpenAIChatGptService(environmentService);
    }
  },
  inject: [EnvironmentService],
};
