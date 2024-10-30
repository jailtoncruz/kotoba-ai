import { Injectable } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from '../../../infraestructure/database/prisma/prisma.service';
import { AiChatService } from '../../../core/abstract/cloud/ai-chat.service';
import { BucketService } from '../../../core/abstract/cloud/bucket.service';
import { TextToSpeechService } from '../../../core/abstract/cloud/text-to-speech.service';
import { LoggerService } from '../../../core/abstract/logger-service';
import { GenerateCardDto } from './dto/generate-card.dto';

@Injectable()
export class CardService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiChatService,
    private bucketService: BucketService,
    private ttsService: TextToSpeechService,
    private logger: LoggerService,
  ) {
    logger.setContext(CardService.name);
    this.generateAudioIfNull();
  }

  async generateAudioIfNull() {
    const cards = await this.prisma.flashcard.findMany({
      where: {
        audioUrl: null,
      },
    });
    for (const card of cards) {
      const filepath = await this.ttsService.generate(card.hiragana);
      const audioUrl = await this.bucketService.upload(filepath, {
        basepath: 'audio-cards/',
        contentType: 'audio/mp3',
        public: true,
      });
      await this.prisma.flashcard.update({
        data: { audioUrl },
        where: { id: card.id },
      });
      this.logger.log(`Audio generated to ${card.hiragana} card.`);
    }
  }

  async generateFlashcards({ quantity, complexity, context }: GenerateCardDto) {
    // Step 1: Request flashcard content from AI, asking for structured JSON output
    const hiraganas = await this.prisma.flashcard.findMany({
      where: {
        complexity,
      },
      select: { hiragana: true },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    const prompt = [
      {
        role: 'system',
        content: 'You are a helpful assistant for learning hiragana.',
      },
      {
        role: 'user',
        content: `Generate up to ${quantity} ${complexity < 3 ? 'basic' : ''} words or phrases in hiragana ${context ? `of the context "${context}"` : ''} with a complexity level of ${complexity} (Consider 1 as level N5 and 5 as N1; consider more than 5 to create longer sentences). 
                  The words or phrases need to be different of these list: ${hiraganas.join(',')}
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
        const filepath = await this.ttsService.generate(suggestion.hiragana);
        const audioUrl = await this.bucketService.upload(filepath, {
          basepath: 'audio-cards/',
          contentType: 'audio/mp3',
          public: true,
        });

        const flashcard = await this.prisma.flashcard.create({
          data: {
            hiragana: suggestion.hiragana,
            meaning: suggestion.meaning,
            type: suggestion.type as CardType,
            complexity: complexity,
            explanation: suggestion.explanation || null,
            audioUrl,
          },
        });
        flashcards.push(flashcard);
        this.logger.log(`New card generated ${suggestion.hiragana}`);
      } else {
        this.logger.log(`Duplicated card ${suggestion.hiragana}`);
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
