import { ExperienceType } from './experience';

export interface JournalEntry {
  id: string;
  question: string;
  audioUri?: string;
  transcription?: string;
  images: string[];
  createdAt: number;
  isProcessing?: boolean;
  experienceType?: ExperienceType;
}

export interface BookOrder {
  id: string;
  entries: string[]; // IDs of journal entries
  status: 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: number;
  experienceType?: ExperienceType;
}