import { LanguageCode } from './language-code';

export interface VoiceOptions {
  name: string;
  languageCode: string;
  ssmlGender: 'SSML_VOICE_GENDER_UNSPECIFIED' | 'MALE' | 'FEMALE' | 'NEUTRAL';
}

export const VoiceOptionsMap = new Map<string, VoiceOptions>([
  [
    'ja-JP',
    {
      languageCode: 'ja-JP',
      ssmlGender: 'FEMALE',
      name: 'ja-JP-Neural2-B',
    },
  ],
  [
    LanguageCode.EN_US,
    {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
      name: 'en-US-Journey-F',
    },
  ],
]);
