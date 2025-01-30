import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import {
  LoggerService,
  TextToSpeechService,
  VoiceOptions,
} from '@monorepo/shared';

interface TTSJobPayload {
  input: string;
  voiceOptions: VoiceOptions;
  extraOptions?: {
    folder?: string;
    filename?: string;
  };
  processingInfo?: {
    attempt?: number;
  };
}

@Processor('tts')
export class TTSProcessor extends WorkerHost {
  constructor(
    @InjectQueue('tts') private ttsQueue: Queue,
    private logger: LoggerService,
    private ttsService: TextToSpeechService,
  ) {
    super();
    logger.setContext('TTS_Processor');
  }

  async process(job: Job<TTSJobPayload>): Promise<any> {
    let attempt = job.data.processingInfo?.attempt ?? 1;

    try {
      this.logger.log(`Processing job [${job.name}]`);
      const { input, voiceOptions, extraOptions } = job.data;
      const filepath = await this.ttsService.generate(
        input,
        voiceOptions,
        extraOptions,
      );
      return filepath;
    } catch (_err) {
      const err = _err as Error;
      this.logger.error(
        `Error on processing job [${job.name}]: ${err.message}`,
      );

      attempt++;
      const newPayload = {
        ...job.data,
        processingInfo: {
          attempt,
        },
      };

      if (attempt <= 3) this.ttsQueue.add(job.name, newPayload);
      else this.logger.error(`Job [${job.name}] achieved max of attempts`);

      return {
        message: `Job [${job.name}] achieved max of attempts`,
        ...newPayload,
      };
    }
  }
}
