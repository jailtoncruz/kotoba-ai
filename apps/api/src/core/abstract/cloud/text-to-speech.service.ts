export interface ITextToSpeechService {
  generate(text: string): Promise<string>;
}

export abstract class TextToSpeechService implements ITextToSpeechService {
  async generate(text: string): Promise<string> {
    return text;
  }
}
