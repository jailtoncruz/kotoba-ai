import { Injectable } from '@nestjs/common';
import { AiChatService } from '../../../core/abstract/cloud/ai-chat.service';
import { GenerateLessonDto } from './dto/generate-lesson.dto';
import { generateCode } from '../../../shared/functions/generate-code';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { VoiceOptionsMap } from '../../../core/constants/voice-options';
import { LoggerService, TTSQueuePayload } from '@monorepo/shared';
import { PrismaService } from 'src/infraestructure/database/prisma/prisma.service';
import { LessonLine } from '@prisma/client';
import { splitTextByJapanese } from '@monorepo/shared/dist/shared/functions';

const INVALID_LINES = ['.', '。', ''];

@Injectable()
export class LessonService {
  constructor(
    private aiService: AiChatService,
    private prisma: PrismaService,
    private logger: LoggerService,
    @InjectQueue('tts')
    private ttsQueue: Queue<
      TTSQueuePayload<{
        returnChannel: string;
        lessonLineId: string;
      }>
    >,
  ) {
    logger.setContext(LessonService.name);
    this.generateAudioIfNull();
  }

  private async generateAudioIfNull() {
    const lines = await this.prisma.lessonLine.findMany({
      where: {
        audioUrl: null,
      },
      include: { lesson: { select: { code: true } } },
    });
    for (const line of lines) {
      await this.addLessonLineToTTSQueue(line.lesson.code, [line]);
    }

    if (lines.length > 0)
      this.logger.log(`Audio generation queued for ${lines.length} cards.`);
  }

  async generateLesson(
    { name, subject, observations }: GenerateLessonDto,
    userId: string,
  ) {
    const code = generateCode();

    const prompt = [
      {
        role: 'system',
        content: 'You are a helpful assistant for learning japanese.',
      },
      {
        role: 'user',
        content: `Generate a complete lesson about "${subject}" as a script to be read.
                Divide the whole lesson into three parts: the first is the introduction, the second is the detailed explanation and the third with some examples.
                Do not include greetings or farewells.
                Do not include romaji, only hiragana, katakana and kanji.
                Write the lesson in one main language (english) and provide the examples in Japanese.
                ${observations ? `Observations: ${observations}` : ''}
                Generate a array with each line of script lesson, use the field languageCode such as US-en and ja-JP for examples in Japanese, each line need to have the sequence, such as 1,2,3,4 etc.
                Respond in plain JSON format with the following schema, without any markdown or code blocks, return a array of these object:
                  {
                    "sequence": number;
                    "text": string;
                    "languageCode": string;
                  }`,
      },
    ];
    const lesson = await this.prisma.lesson.create({
      data: {
        title: name,
        description: subject,
        authorId: userId,
        code,
      },
    });
    const aiResponse = await this.aiService.completion(prompt);
    const content: {
      sequence: number;
      text: string;
      languageCode: string;
    }[] = JSON.parse(aiResponse.message.content);
    const afterSplit = [];
    content.forEach((line) =>
      afterSplit.push(...splitTextByJapanese(line.text)),
    );

    const lessonLines = afterSplit
      .filter(
        (line) => !INVALID_LINES.includes(line.text.replaceAll("'", '').trim()),
      )
      .map((line, index) => ({
        ...line,
        sequence: index + 1,
        text: line.text.replaceAll("'", '').trim(),
      }));

    await this.prisma.lessonLine.createMany({
      data: lessonLines.map((line) => ({
        languageCode: line.languageCode,
        order: line.sequence,
        text: line.text,
        lessonId: lesson.id,
      })),
    });

    const lines = await this.prisma.lessonLine.findMany({
      where: { lessonId: lesson.id },
      orderBy: { order: 'asc' },
    });

    await this.addLessonLineToTTSQueue(code, lines);

    return {
      ...lesson,
      lines,
    };
  }

  private async addLessonLineToTTSQueue(
    codeLesson: string,
    lines: LessonLine[],
  ) {
    await this.ttsQueue.addBulk(
      lines.map((line) => ({
        name: line.id,
        data: {
          input: line.text,
          voiceOptions: VoiceOptionsMap.get(line.languageCode),
          extraOptions: {
            folder: `audio-lessons/${codeLesson}`,
            filename: `${codeLesson}-${line.order.toString().padStart(3, '0')}.mp3`,
            uploadOptions: {
              basepath: `audio-lessons/${codeLesson}/`,
              contentType: 'audio/mp3',
              public: true,
            },
          },
          output: {
            returnChannel: 'lesson_tts_completed',
            lessonLineId: line.id,
          },
        },
        opts: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      })),
    );
  }
}
