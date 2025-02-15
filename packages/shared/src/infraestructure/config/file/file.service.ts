import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { splitPathToArray } from '../../../shared/functions';

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

    const acc: string[] = [];
    for (let part of splitPathToArray(name)) {
      acc.push(part);
      const path = resolve(this.workdir, ...acc);
      if (!existsSync(path)) mkdirSync(path);
    }

    return folder;
  }
}
