import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FileService {
  constructor() {
    if (!existsSync(this.workdir)) mkdirSync(this.workdir);
  }
  private get workdir() {
    return resolve(process.cwd(), 'workdir');
  }

  getOrCreateFolder(name: string) {
    const folder = resolve(this.workdir, name);
    if (!existsSync(folder)) mkdirSync(folder);
    return folder;
  }
}
