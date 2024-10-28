import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../../../config/environment/environment.service';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { writeFile } from 'node:fs/promises';
import { TextToSpeechService } from '../../../../core/abstract/cloud/text-to-speech.service';

@Injectable()
export class GcpTextToSpeechService extends TextToSpeechService {
  private client: TextToSpeechClient;
  constructor(private environment: EnvironmentService) {
    super();
    this.client = new TextToSpeechClient({
      keyFilename: this.environment.getGoogleCloudKeyPath(),
    });
  }

  async generate(text: string) {
    // Performs the text-to-speech request
    const [response] = await this.client.synthesizeSpeech({
      input: {
        text,
      },
      voice: {
        languageCode: 'ja-JP',
        ssmlGender: 'FEMALE',
        name: 'ja-JP-Neural2-B',
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Save the generated binary audio content to a local file
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3', text);
  }
}
