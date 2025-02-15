export interface ISpeechToTextService {
  identify(uri: string): Promise<any>;
}

export abstract class SpeechToTextService implements ISpeechToTextService {
  async identify(uri: string): Promise<any> {
    return uri;
  }
}
