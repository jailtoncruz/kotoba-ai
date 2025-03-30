import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import {
  BucketService,
  LoggerService,
  TextToSpeechService,
  TTSOutput,
  TTSQueuePayload,
} from '@monorepo/shared';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Processor('tts')
export class TTSProcessor extends WorkerHost {
  constructor(
    private logger: LoggerService,
    private ttsService: TextToSpeechService,
    private bucketService: BucketService,
    @Inject('TTS_SERVICE') private client: ClientProxy,
  ) {
    super();
    logger.setContext('TTS_Processor');
  }

  async process(job: Job<TTSQueuePayload<TTSOutput>>): Promise<any> {
    this.logger.log(`Processing job [${job.name}] [${job.attemptsMade}]`);
    try {
      const { input, voiceOptions, extraOptions } = job.data;
      const filepath = await this.ttsService.generate(
        input,
        voiceOptions,
        extraOptions,
      );

      let audioUrl: string | undefined = '';
      if (job.data.extraOptions?.uploadOptions) {
        const options = job.data.extraOptions?.uploadOptions;
        audioUrl = await this.bucketService.upload(filepath, options);
      }
      this.logger.log(`Processing job [${job.name}] Finished`);
      this.client.emit(
        { cmd: job.data.output.returnChannel },
        {
          jobId: job.id,
          data: { ...job.data.output, audioUrl },
        },
      );

      return filepath;
    } catch (_err) {
      this.logger.error(`Processing job [${job.name}] Failed`);
      console.log(_err, job.data);
      throw _err;
    }
  }
}
