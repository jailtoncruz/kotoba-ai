export interface ITextToSpeechService {
  generate(text: string): Promise<any>;
}

export abstract class TextToSpeechService implements ITextToSpeechService {
  async generate(text: string): Promise<any> {
    return text;
  }
}
