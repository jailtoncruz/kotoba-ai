import { Global, Module } from '@nestjs/common';
import { CloudVisionServiceProvider } from './cloud-vision/cloud-vision.provider';
import { AiChatServiceProvider } from './ai-chat/ai-chat.provider';
import { BucketServiceProvider } from './bucket/bucket.provider';
import { SpeechToTextServiceProvider } from './speech-to-text/speech-to-text.provider';

const providers = [
  CloudVisionServiceProvider,
  AiChatServiceProvider,
  BucketServiceProvider,
  SpeechToTextServiceProvider,
];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class CloudModule {}
