import { VoiceOptions } from './voice-options';

export interface TTSOutput {
  returnChannel: string;
}

export interface TTSQueuePayload<OutputType extends TTSOutput> {
  input: string;
  voiceOptions: VoiceOptions;
  extraOptions?: {
    folder?: string;
    filename?: string;
    uploadOptions?: {
      basepath: string;
      contentType: string;
      public: boolean;
    };
  };
  output: OutputType;
}
