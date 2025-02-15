export interface IAiChatService {
  completion(message: Array<any>, model?: string): Promise<any>;
}

export abstract class AiChatService implements IAiChatService {
  async completion(message: Array<any>, model?: string): Promise<any> {
    return { message, model };
  }
}
