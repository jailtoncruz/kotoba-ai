import { Global, Module } from '@nestjs/common';
import { CloudVisionServiceProvider } from './cloud-vision/cloud-vision.provider';
import { AiChatServiceProvider } from './ai-chat/ai-chat.provider';
import { BucketServiceProvider } from './bucket/bucket.provider';
import { SpeechToTextServiceProvider } from './speech-to-text/speech-to-text.provider';
import { TextToSpeechServiceProvider } from './text-to-speech/text-to-speech.provider';

const providers = [
  CloudVisionServiceProvider,
  AiChatServiceProvider,
  BucketServiceProvider,
  SpeechToTextServiceProvider,
  TextToSpeechServiceProvider,
];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class CloudModule {}
