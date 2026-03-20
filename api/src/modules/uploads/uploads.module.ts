import { Module } from '@nestjs/common';
import { CloudinaryImageUploaderService } from './cloudinary-image-uploader.service';
import { CloudinaryAudioUploaderService } from './cloudinary-audio-uploader.service';

@Module({
  providers: [CloudinaryImageUploaderService, CloudinaryAudioUploaderService],
  exports: [CloudinaryImageUploaderService, CloudinaryAudioUploaderService],
})
export class UploadsModule {}
