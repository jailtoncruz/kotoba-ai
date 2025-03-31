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
import { LanguageCode } from '@monorepo/shared/dist/core/constants';

const INVALID_LINES = ['.', '。', ''];
const JA_SPECIAL_CARACTERS = [
  '.',
  '。',
  '',
  '々',
  '〆',
  '〤',
  'ヶ',
  '。',
  '、',
  '！',
  '？',
  '…',
  '〜',
  '・',
];

function splitJapaneseTextToNewLines(aiResponse: LessonLine[]): LessonLine[] {
  // Regex to match Japanese text including punctuation and quotes
  const japaneseRegex =
    /([『』「」]?[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]+[々〆〤ヶ]?[』」]?[。、！？…〜・]*)/g;
  return aiResponse.map((item) => {
    // Skip if text is already multiline or empty
    if (item.text.includes('\n') || item.text.trim().length === 0) {
      return item;
    }

    // Process text containing Japanese characters
    if (japaneseRegex.test(item.text)) {
      const newText = item.text
        // Add newlines before Japanese text
        .replace(
          /([^\n])([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF])/g,
          '$1\n$2',
        )
        // Add newlines after Japanese text
        .replace(
          /([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF])([^\n])/g,
          '$1\n$2',
        )
        // Clean up multiple newlines
        .replace(/\n{2,}/g, '\n')
        .trim();

      return {
        ...item,
        text: newText,
      };
    }

    return item;
  });
}

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
                Generate a array with each line of script lesson, use the field languageCode such as en-US and ja-JP for examples in Japanese, each line need to have the sequence, such as 1,2,3,4 etc.
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
        observations,
      },
    });
    const aiResponse = await this.aiService.completion(prompt);
    const content: {
      sequence: number;
      text: string;
      languageCode: string;
    }[] = JSON.parse(aiResponse.message.content);
    // const afterSplit = [];

    // content.forEach((line) =>
    //   afterSplit.push(...splitTextByJapanese(line.text)),
    // );

    // const lessonLines = afterSplit
    //   .filter(
    //     (line) => !INVALID_LINES.includes(line.text.replaceAll("'", '').trim()),
    //   )
    //   .map((line, index) => ({
    //     ...line,
    //     sequence: index + 1,
    //     text: line.text.replaceAll("'", '').trim(),
    //   }));

    let lessonLines: {
      text: string;
      languageCode: LanguageCode;
    }[] = [];

    for (const line of content) {
      let lines: {
        text: string;
        languageCode: LanguageCode;
      }[] = [];

      for (const word of line.text.split(' ')) {
        const language =
          /([『』「」]?[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]+[々〆〤ヶ]?[』」]?[。、！？…〜・]*)/g.test(
            word,
          )
            ? 'ja-JP'
            : 'en-US';
        const lastLine = lines.pop();

        if (lastLine && lastLine.languageCode === language) {
          lastLine.text += ' ' + word;
          lines.push(lastLine);
        } else {
          if (lastLine) lines.push(lastLine);
          lines.push({
            text: word,
            languageCode: language,
          });
        }
      }

      lessonLines.push(...lines);
    }

    await this.prisma.lessonLine.createMany({
      data: lessonLines.map((line, index) => ({
        languageCode: line.languageCode,
        order: index + 1,
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
      aiResponse: content,
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

  async getLessonById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { lines: { orderBy: { order: 'asc' } } },
    });

    return lesson;
  }

  async listLessonsByUserId(userId: string) {
    return await this.prisma.lesson.findMany({
      where: { authorId: userId, deleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteLesson(lessonId: string) {
    await this.prisma.lesson.update({
      data: {
        deleted: true,
      },
      where: { id: lessonId },
    });
  }
}
