export enum ProcessingStatus {
  Waiting = 'Várakozás...',
  Processing = 'Feldolgozás...',
  Done = 'Kész!',
  Error = 'Hiba',
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  thumbnailUrl: string;
  originalSize: number;
  status: ProcessingStatus;
  processedSize?: number;
  percentageSaved?: number;
  processedBlob?: Blob; // webp letöltéshez
  downloaded?: boolean; // új mező: letöltötte-e a user
}

export interface ConversionSettings {
  preset: string;
  maxWidth: string;
  maxHeight: string;
  quality: number;
}
