import { VoiceOptions } from '../../interfaces/voice-options';

export interface ExtraOptions {
  filename?: string;
  folder?: string;
}

export interface ITextToSpeechService {
  generate(
    text: string,
    voiceOptions: VoiceOptions,
    extraOptions?: ExtraOptions,
  ): Promise<string>;
}

export abstract class TextToSpeechService implements ITextToSpeechService {
  async generate(
    text: string,
    voiceOptions: VoiceOptions,
    extraOptions?: ExtraOptions,
  ): Promise<string> {
    return text + voiceOptions.languageCode + extraOptions?.filename;
  }
}
