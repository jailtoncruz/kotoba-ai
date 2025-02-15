import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { AiChatService } from '../../../../core/abstract/cloud/ai-chat.service';
import { EnvironmentService } from '../../../config/environment/environment.service';

@Injectable()
export class OpenAIChatGptService extends AiChatService {
  private client: OpenAI;
  constructor(private environment: EnvironmentService) {
    super();
    this.client = new OpenAI({
      apiKey: this.environment.getOpenAiApiKey(),
    });
  }

  async completion(message: Array<any>, model: string = 'gpt-4o-mini') {
    const completion = await this.client.chat.completions.create({
      model,
      messages: message,
    });

    return completion.choices[0];
  }
}
