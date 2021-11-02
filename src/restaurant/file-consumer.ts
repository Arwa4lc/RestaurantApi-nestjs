import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';

@Processor('fileOperation')
export class FileConsumer {
  @Process('delete-file')
  async fileDeletionJob(job: Job<unknown>) {
    const jobData: any = job.data;

    await fs.unlinkSync(jobData.filePath);
  }
}
