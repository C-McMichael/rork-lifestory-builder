export type ExperienceType = 'daily' | 'simple_life_story' | 'comprehensive_life_story';

export interface Experience {
  id: ExperienceType;
  name: string;
  description: string;
  icon: string;
  estimatedTime: string;
  questionCount?: number;
  features: string[];
}

export interface ExperienceProgress {
  experienceType: ExperienceType;
  currentChapter: number;
  totalChapters: number;
  questionsAnswered: number;
  totalQuestions: number;
  startedAt: number;
  lastActivityAt: number;
}