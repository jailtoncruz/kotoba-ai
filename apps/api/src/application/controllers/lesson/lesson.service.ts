import { Inject, Injectable } from '@nestjs/common';
import { AiChatService } from '../../../core/abstract/cloud/ai-chat.service';
import { GenerateLessonDto } from './dto/generate-lesson.dto';
import { LessonScriptLine } from '../../../core/domain/lesson-script-line';
import { splitTextByJapanese } from '../../../shared/functions/split-japanese-parts';
import { TextToSpeechService } from '../../../core/abstract/cloud/text-to-speech.service';
import { LanguageCode } from '../../../core/constants/language-code';
import { generateCode } from '../../../shared/functions/generate-code';
import { FileService } from '../../../infraestructure/config/file/file.service';
import { writeFile } from 'fs/promises';
import { LoggerService } from '../../../core/abstract/logger-service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class LessonService {
  constructor(
    private aiService: AiChatService,
    private ttsService: TextToSpeechService,
    private fileService: FileService,
    private logger: LoggerService,
    @InjectQueue('tts') private ttsQueue: Queue,
  ) {
    logger.setContext(LessonService.name);
  }
  async generateLesson({ name, subject, observations }: GenerateLessonDto) {
    const code = generateCode();

    console.time('generateLesson:ai_completion');
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

    const aiResponse = await this.aiService.completion(prompt);
    const content: LessonScriptLine[] = JSON.parse(aiResponse.message.content);
    const afterSplit = [];
    content.forEach((line) =>
      afterSplit.push(...splitTextByJapanese(line.text)),
    );

    const lessonLines: LessonScriptLine[] = afterSplit.map((line, index) => ({
      ...line,
      sequence: index + 1,
      text: line.text.replaceAll("'", ''),
    }));
    console.timeEnd('generateLesson:ai_completion');

    console.time('generateLesson:tts_generation');
    for (const line of lessonLines) {
      try {
        await this.ttsService.generate(
          line.text,
          {
            languageCode: line.languageCode,
            ssmlGender: 'FEMALE',
            name:
              line.languageCode === LanguageCode.JA_JP
                ? 'ja-JP-Neural2-B'
                : 'en-US-Journey-F',
          },
          {
            folder: `lesson-audios/${code}`,
            filename: `${code}-${line.sequence.toString().padStart(3, '0')}.mp3`,
          },
        );
      } catch (_err) {
        const err = _err as Error;
        this.logger.error(
          `Error generating audio for line ${line.sequence}: ${err.message}`,
        );
      }
    }
    console.timeEnd('generateLesson:tts_generation');

    const folderPath = this.fileService.getOrCreateFolder('lesson-audios');
    await writeFile(
      `${folderPath}/${code}.json`,
      JSON.stringify(lessonLines, null, 2),
    );

    // const audioUrl = await this.bucketService.upload(filepath, {
    //   basepath: 'audio-cards/',
    //   contentType: 'audio/mp3',
    //   public: true,
    // });

    return {
      code,
      name,
      subject,
      lines: lessonLines,
      total: lessonLines.length,
    };
  }

  async tts() {
    const input = 'こんにちは、私は日本語を話すことができます。';
    const code = generateCode();
    this.ttsQueue.add(code, { input });
    return input;
  }
}
