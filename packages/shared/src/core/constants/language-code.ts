import { VoiceOptions } from '../interfaces/voice-options';

export type LanguageCode =
  | 'en-US' // English (United States)
  | 'zh-CN' // Chinese (Simplified, China)
  | 'hi-IN' // Hindi (India)
  | 'es-ES' // Spanish (Spain)
  | 'fr-FR' // French (France)
  | 'ar-SA' // Arabic (Saudi Arabia)
  | 'bn-IN' // Bengali (India)
  | 'ru-RU' // Russian (Russia)
  | 'pt-BR' // Portuguese (Brazil)
  | 'id-ID' // Indonesian (Indonesia)
  | 'de-DE' // German (Germany)
  | 'ja-JP' // Japanese (Japan)
  | 'ko-KR' // Korean (South Korea)
  | 'vi-VN' // Vietnamese (Vietnam)
  | 'it-IT' // Italian (Italy)
  | 'tr-TR' // Turkish (Turkey)
  | 'fa-IR' // Persian (Iran)
  | 'pl-PL' // Polish (Poland)
  | 'uk-UA'; // Ukrainian (Ukraine)

export const VoiceOptionsMap = new Map<LanguageCode, VoiceOptions>([
  [
    'ja-JP',
    {
      languageCode: 'ja-JP',
      ssmlGender: 'FEMALE',
      name: 'ja-JP-Neural2-B',
    },
  ],
  [
    'en-US',
    {
      languageCode: 'en-US',
      ssmlGender: 'FEMALE',
      name: 'en-US-Journey-F',
    },
  ],
]);
