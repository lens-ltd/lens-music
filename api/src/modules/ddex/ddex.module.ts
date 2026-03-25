import { Module } from '@nestjs/common';
import { DdexErnGeneratorService } from './ddex-ern-generator.service';

@Module({
  providers: [DdexErnGeneratorService],
  exports: [DdexErnGeneratorService],
})
export class DdexModule {}
