import { Provider } from '@nestjs/common';
import { EnvironmentService } from '../../config/environment/environment.service';
import { GcpCloudVisionService } from './google-cloud/gcp-cloud-vision.service';
import { CloudVisionService } from '../../../core/abstract/cloud/cloud-vision.service';

export const CloudVisionServiceProvider: Provider = {
  provide: CloudVisionService,
  useFactory: (environmentService: EnvironmentService) => {
    switch (environmentService.getNodeEnvironment()) {
      // case 'production':
      //   return new CloudFlareR2Service(environmentService);
      // case 'development':
      //   return new MinioService(environmentService);
      // case 'test':
      //   return new MockBucketService();
      default:
        return new GcpCloudVisionService(environmentService);
    }
  },
  inject: [EnvironmentService],
};
