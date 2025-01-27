import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';

@Processor('tts')
export class TTSConsumer extends WorkerHost {
  constructor(@InjectQueue('tts') private ttsQueue: Queue) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    return new Promise((resolve) => {
      console.log('TTSConsumer: ', job.name);

      setTimeout(() => {
        resolve({
          name: job.name,
          data: job.data,
        });
      }, 1000);
    });
  }
}
