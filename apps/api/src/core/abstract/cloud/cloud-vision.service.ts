export interface ICloudVisionService {
  identify(imagePath: string, isUrl: boolean): Promise<any>;
}

export abstract class CloudVisionService implements ICloudVisionService {
  identify(imagePath: string, isUrl: boolean): Promise<any> {
    throw new Error(
      'Method not implemented.\n' +
        JSON.stringify({ imagePath, isUrl }, null, 2),
    );
  }
}
