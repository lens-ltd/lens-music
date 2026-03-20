import { Module } from '@nestjs/common';
import { CloudinaryImageUploaderService } from './cloudinary-image-uploader.service';

@Module({
  providers: [CloudinaryImageUploaderService],
  exports: [CloudinaryImageUploaderService],
})
export class UploadsModule {}
