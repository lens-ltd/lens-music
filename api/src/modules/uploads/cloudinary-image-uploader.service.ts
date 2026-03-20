import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export interface UploadImageInput {
  file: Express.Multer.File | undefined;
  folder?: string;
}

export interface UploadedImageResult {
  secureUrl: string;
  publicId: string;
  originalName: string;
  bytes: number;
  format?: string;
  resourceType: string;
}

@Injectable()
export class CloudinaryImageUploaderService {
  private readonly cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  private readonly apiKey = process.env.CLOUDINARY_API_KEY;
  private readonly apiSecret = process.env.CLOUDINARY_API_SECRET;

  async uploadImage({ file, folder }: UploadImageInput): Promise<UploadedImageResult> {
    this.validateConfiguration();
    this.validateFile(file);

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: this.apiKey,
      api_secret: this.apiSecret,
    });

    try {
      const result = await this.uploadBuffer(file.buffer, {
        folder,
        resource_type: 'image',
      });

      return {
        secureUrl: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        bytes: result.bytes,
        format: result.format,
        resourceType: result.resource_type,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  private validateConfiguration() {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new InternalServerErrorException('Cloudinary is not configured');
    }
  }

  private validateFile(file: Express.Multer.File | undefined): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException('Image file size must be 10MB or less');
    }
  }

  private uploadBuffer(
    buffer: Buffer,
    options: {
      folder?: string;
      resource_type: 'image';
    },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result);
      });

      stream.end(buffer);
    });
  }
}
