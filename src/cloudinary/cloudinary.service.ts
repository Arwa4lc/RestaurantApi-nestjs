import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(file) {
    return new Promise((resolve) => {
      v2.uploader.upload(file, { resource_type: 'auto' }, (error, result) => {
        resolve({ image: result.url });
      });
    });
  }
}
