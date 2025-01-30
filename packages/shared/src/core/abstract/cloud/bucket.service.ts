export interface ListObjectOptions {
  prefix?: string;
  recursive?: boolean;
}

export interface CreatePreSignedOptions {
  object: string;
  expireAt: number;
  contentType?: string;
}

export interface IBucketUploadOptions {
  basepath?: string;
  contentType?: string;
  public?: boolean;
}

export interface IBucketService {
  createBucket(name: string): Promise<string>;
  isBucketExists(name: string): Promise<boolean>;
  deleteBucket(name: string): Promise<void>;
  listObjects(options: ListObjectOptions): Promise<any[]>;
  deleteObjects(objects: string[]): Promise<void>;
  deleteObject(object: string): Promise<void>;
  createPresignedGetObject(options: CreatePreSignedOptions): Promise<string>;
  createPresignedPutObject(options: CreatePreSignedOptions): Promise<string>;
  upload(filepath: string, options?: IBucketUploadOptions): Promise<any>;
}

export abstract class BucketService implements IBucketService {
  upload(filepath: string, options?: IBucketUploadOptions): Promise<any> {
    throw new Error(filepath + options?.basepath);
  }
  createBucket(name: string): Promise<string> {
    throw new Error(name);
  }
  isBucketExists(name: string): Promise<boolean> {
    throw new Error(name);
  }
  deleteBucket(name: string): Promise<void> {
    throw new Error(name);
  }
  listObjects(options: ListObjectOptions): Promise<any[]> {
    throw new Error(JSON.stringify(options));
  }
  deleteObjects(objects: string[]): Promise<void> {
    throw new Error(JSON.stringify(objects));
  }
  deleteObject(object: string): Promise<void> {
    throw new Error(JSON.stringify(object));
  }
  createPresignedGetObject(options: CreatePreSignedOptions): Promise<string> {
    throw new Error(JSON.stringify(options));
  }
  createPresignedPutObject(options: CreatePreSignedOptions): Promise<string> {
    throw new Error(JSON.stringify(options));
  }
}
