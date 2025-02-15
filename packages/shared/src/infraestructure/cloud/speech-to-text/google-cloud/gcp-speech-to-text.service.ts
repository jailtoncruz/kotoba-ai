import { Injectable } from '@nestjs/common';
import { SpeechClient, protos } from '@google-cloud/speech';
import { SpeechToTextService } from '../../../../core/abstract/cloud/speech-to-text.service';
import { EnvironmentService } from '../../../config/environment/environment.service';

@Injectable()
export class GcpSpeechToTextService extends SpeechToTextService {
  private client: SpeechClient;
  constructor(private environment: EnvironmentService) {
    super();
    this.client = new SpeechClient({
      keyFilename: this.environment.getGoogleCloudKeyPath(),
    });
  }

  async identify(
    file: string,
  ): Promise<protos.google.cloud.speech.v1.IRecognizeResponse> {
    const audio = {
      uri: `gs://tom_cruz-tts/${file}`,
    };
    const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
      encoding:
        protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3,
      sampleRateHertz: 48000,
      languageCode: 'ja-JP',
      enableSpokenPunctuation: { value: true },
    };
    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await this.client.recognize(request);

    const transcription = response.results
      ?.map((result) => {
        if (result.alternatives) return result.alternatives[0].transcript;
        return '';
      })
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    return response;
  }
}
