import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024;

export interface UploadAudioInput {
  file: Express.Multer.File | undefined;
  folder?: string;
}

export interface UploadedAudioResult {
  secureUrl: string;
  publicId: string;
  originalName: string;
  bytes: number;
  format?: string;
  durationMs?: number;
  resourceType: string;
}

export interface UploadSignatureResult {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

@Injectable()
export class CloudinaryAudioUploaderService {
  private readonly logger = new Logger(CloudinaryAudioUploaderService.name);
  private readonly cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  private readonly apiKey = process.env.CLOUDINARY_API_KEY;
  private readonly apiSecret = process.env.CLOUDINARY_API_SECRET;

  /**
   * Removes an asset from Cloudinary. Swallows errors so callers can continue
   * (e.g. after a successful replacement upload).
   */
  async destroyAudio(publicId: string): Promise<void> {
    const trimmed = publicId?.trim();
    if (!trimmed) {
      return;
    }

    try {
      this.validateConfiguration();
      cloudinary.config({
        cloud_name: this.cloudName,
        api_key: this.apiKey,
        api_secret: this.apiSecret,
      });
      await cloudinary.uploader.destroy(trimmed, { resource_type: 'video' });
    } catch (error) {
      this.logger.warn(
        `Cloudinary destroy failed for public_id=${trimmed}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  generateUploadSignature(folder: string): UploadSignatureResult {
    this.validateConfiguration();

    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(
      params,
      this.apiSecret!,
    );

    return {
      signature,
      timestamp,
      cloudName: this.cloudName!,
      apiKey: this.apiKey!,
      folder,
    };
  }

  async uploadAudio({ file, folder }: UploadAudioInput): Promise<UploadedAudioResult> {
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
        resource_type: 'video',
      });

      return {
        secureUrl: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        bytes: result.bytes,
        format: result.format,
        durationMs: result.duration ? Math.round(result.duration * 1000) : undefined,
        resourceType: result.resource_type,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload audio file');
    }
  }

  private validateConfiguration() {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new InternalServerErrorException('Cloudinary is not configured');
    }
  }

  private validateFile(file: Express.Multer.File | undefined): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    if (!file.mimetype?.startsWith('audio/')) {
      throw new BadRequestException('Only audio files are allowed');
    }

    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      throw new BadRequestException('Audio file size must be 50MB or less');
    }
  }

  private uploadBuffer(
    buffer: Buffer,
    options: {
      folder?: string;
      resource_type: 'video';
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
