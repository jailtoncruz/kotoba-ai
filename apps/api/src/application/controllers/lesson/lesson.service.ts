import { Injectable } from '@nestjs/common';
import { AiChatService } from '../../../core/abstract/cloud/ai-chat.service';

export interface ScriptLine {
  sequence: number;
  dialog: string;
  languageCode: string;
}

@Injectable()
export class LessonService {
  constructor(private aiService: AiChatService) {}
  async generateLesson(theme: string) {
    const prompt = [
      {
        role: 'system',
        content: 'You are a helpful assistant for learning japanese.',
      },
      {
        role: 'user',
        content: `Generate a complete lesson about "${theme}" as a script to be read.
                Generate a array with each line of script lesson, use the field languageCode such as US-en and ja-JP for examples in Japanese, each line need to have the sequence, such as 1,2,3,4 etc.
                Respond in plain JSON format with the following schema, without any markdown or code blocks, return a array of these object:
                  {
                    "sequence": number;
                    "dialog": string;
                    "languageCode": string;
                  }`,
      },
    ];

    const aiResponse = await this.aiService.completion(prompt);

    return {
      name: 'lesson',
      theme,
      content: aiResponse.message.content,
    };
  }
}
