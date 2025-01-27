export interface VoiceOptions {
  name: string;
  languageCode: string;
  ssmlGender: 'SSML_VOICE_GENDER_UNSPECIFIED' | 'MALE' | 'FEMALE' | 'NEUTRAL';
}

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
    return text + voiceOptions.languageCode + extraOptions.filename;
  }
}
