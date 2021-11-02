import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class FileProducerService {
  constructor(@InjectQueue('fileOperation') private queue: Queue) {}

  async deleteFile(file: Express.Multer.File) {
    await this.queue.add('delete-file', {
      filePath: file.path,
    });
  }
}
