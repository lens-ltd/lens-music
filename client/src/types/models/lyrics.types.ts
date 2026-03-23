import { AbstractEntity } from "./index.types";

export interface TimedLyricLine {
  time?: number;
  text: string;
}

export interface Lyrics extends AbstractEntity {
  trackId: string;
  language: string;
  content: TimedLyricLine[];
}
