import { Injectable } from '@nestjs/common';

/**
 * Phase 3: Build DDEX ERN 4.x NewReleaseMessage XML from domain entities.
 * Delivery (SFTP/HTTPS), XSD validation, and batching will plug in here.
 */
@Injectable()
export class DdexErnGeneratorService {
  /** Placeholder until XML generation is implemented. */
  generatePlaceholderMessageId(): string {
    return `ern-placeholder-${Date.now()}`;
  }
}
