import { Injectable } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from '../../../infraestructure/database/prisma/prisma.service';
import { AiChatService } from '../../../core/abstract/cloud/ai-chat.service';

@Injectable()
export class CardService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiChatService,
  ) {}

  async generateFlashcards(complexity: number) {
    // Step 1: Request flashcard content from AI, asking for structured JSON output
    const prompt = [
      {
        role: 'system',
        content: 'You are a helpful assistant for learning hiragana.',
      },
      {
        role: 'user',
        content: `Generate up to 10 basic words or phrases in hiragana with a complexity level of ${complexity}. 
                  Respond in plain JSON format with the following schema, without any markdown or code blocks, return a array of these object:
                  {
                    "hiragana": string,
                    "meaning": string,
                    "type": "WORD" | "PHRASE",
                    "explanation"?: string
                  }`,
      },
    ];

    const aiResponse = await this.aiService.completion(prompt);

    // Step 2: Parse the AI's JSON response
    const suggestions = this.parseAiResponse(aiResponse.message.content);

    // Step 3: Save each suggestion as a new flashcard in the database
    const flashcards = [];

    for (const suggestion of suggestions) {
      // Step 2: Check for duplicates based on hiragana field
      const existingCard = await this.prisma.flashcard.findUnique({
        where: { hiragana: suggestion.hiragana },
      });

      if (!existingCard) {
        // Step 3: If no duplicate found, create the new flashcard
        const flashcard = await this.prisma.flashcard.create({
          data: {
            hiragana: suggestion.hiragana,
            meaning: suggestion.meaning,
            type: suggestion.type as CardType,
            complexity: complexity,
            explanation: suggestion.explanation || null,
          },
        });
        flashcards.push(flashcard);
      }
    }

    return flashcards;
  }

  private parseAiResponse(response: string): Array<{
    hiragana: string;
    meaning: string;
    type: CardType;
    explanation?: string;
  }> {
    try {
      // Parse the response as JSON directly
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return [];
    }
  }
}
