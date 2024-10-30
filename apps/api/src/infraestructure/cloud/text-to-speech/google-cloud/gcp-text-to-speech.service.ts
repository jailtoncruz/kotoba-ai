import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../../../config/environment/environment.service';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { writeFile } from 'node:fs/promises';
import { TextToSpeechService } from '../../../../core/abstract/cloud/text-to-speech.service';
import { FileService } from '../../../config/file/file.service';
import { resolve } from 'path';

@Injectable()
export class GcpTextToSpeechService extends TextToSpeechService {
  private client: TextToSpeechClient;
  constructor(
    private environment: EnvironmentService,
    private fileService: FileService,
  ) {
    super();
    this.client = new TextToSpeechClient({
      keyFilename: this.environment.getGoogleCloudKeyPath(),
    });
  }

  async generate(text: string): Promise<string> {
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
    const folderPath = this.fileService.getOrCreateFolder('tts-files');
    const filepath = resolve(folderPath, `${text}.mp3`);
    await writeFile(filepath, response.audioContent, 'binary');
    return filepath;
  }
}
