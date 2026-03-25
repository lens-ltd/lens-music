import type { AbstractEntity } from './index.types';

export interface ReleaseTerritoryDetail extends AbstractEntity {
  releaseId: string;
  territory: string;
  title?: string;
  displayArtistName?: string;
  labelName?: string;
}

export interface ReleaseTerritoryDetailPayload {
  territory?: string;
  title?: string;
  displayArtistName?: string;
  labelName?: string;
}
