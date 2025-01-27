import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../../../config/environment/environment.service';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { writeFile } from 'node:fs/promises';
import {
  ExtraOptions,
  TextToSpeechService,
  VoiceOptions,
} from '../../../../core/abstract/cloud/text-to-speech.service';
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

  async generate(
    text: string,
    voiceOptions: VoiceOptions,
    extraOptions?: ExtraOptions,
  ): Promise<string> {
    // Performs the text-to-speech request
    const [response] = await this.client.synthesizeSpeech({
      input: {
        text,
      },
      voice: {
        languageCode: voiceOptions.languageCode,
        name: voiceOptions.name,
        ssmlGender: voiceOptions.ssmlGender,
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Save the generated binary audio content to a local file
    const folderPath = this.fileService.getOrCreateFolder(
      extraOptions?.folder ?? 'tts-files',
    );
    const filepath = resolve(
      folderPath,
      extraOptions?.filename ?? `${text}.mp3`,
    );
    await writeFile(filepath, response.audioContent, 'binary');
    return filepath;
  }
}
