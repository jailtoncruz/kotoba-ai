import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import CloudVision, { ImageAnnotatorClient } from '@google-cloud/vision';
import { CloudVisionService } from '../../../../core/abstract/cloud/cloud-vision.service';
import { EnvironmentService } from '../../../config/environment/environment.service';

@Injectable()
export class GcpCloudVisionService extends CloudVisionService {
  private client: ImageAnnotatorClient;
  constructor(private environment: EnvironmentService) {
    super();
    this.client = new CloudVision.ImageAnnotatorClient({
      keyFilename: this.environment.getGoogleCloudKeyPath(),
    });
  }

  async identify(imagePath: string, isUrl: boolean = false) {
    try {
      let request: any;

      if (isUrl) {
        // If the input is a URL
        request = {
          image: { source: { imageUri: imagePath } }, // Image from URL
        };
      } else if (imagePath.startsWith('data:image')) {
        // If the input is a Base64 image string
        const base64Image = imagePath.split(',')[1]; // Extract the Base64 part
        request = {
          image: { content: base64Image }, // Base64-encoded image
        };
      } else {
        // If the input is a local file
        const imageBuffer = readFileSync(imagePath); // Read the file as a buffer
        request = {
          image: { content: imageBuffer.toString('base64') }, // Convert to Base64 string
        };
      }

      // Call the Vision API for document (handwritten) text detection
      const [result] = await this.client.documentTextDetection({
        ...request,
        imageContext: {
          languageHints: ['ja'], // 'ja' is the language code for Japanese
        },
      });

      const fullTextAnnotation = result.fullTextAnnotation;

      // Log detected text
      if (fullTextAnnotation && fullTextAnnotation.text) {
        console.log('Handwritten text detected:');
        console.log(fullTextAnnotation.text); // Full handwritten text
      } else {
        console.log('No handwritten text detected in the image.');
      }

      return fullTextAnnotation;
    } catch (error) {
      console.error('Error detecting handwritten text:', error);
      throw error;
    }
  }
}
