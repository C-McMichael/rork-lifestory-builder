import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExperienceType, ExperienceProgress } from '@/types/experience';

interface ExperienceState {
  currentExperience: ExperienceType;
  experienceProgress: Record<ExperienceType, ExperienceProgress | null>;
  setCurrentExperience: (experience: ExperienceType) => void;
  updateProgress: (experienceType: ExperienceType, updates: Partial<ExperienceProgress>) => void;
  getCurrentQuestion: (experienceType: ExperienceType) => string | null;
  markQuestionAnswered: (experienceType: ExperienceType) => void;
  resetExperience: (experienceType: ExperienceType) => void;
}

export const useExperienceStore = create<ExperienceState>()(
  persist(
    (set, get) => ({
      currentExperience: 'daily',
      experienceProgress: {
        daily: null,
        simple_life_story: null,
        comprehensive_life_story: null,
      },
      
      setCurrentExperience: (experience) => {
        set({ currentExperience: experience });
        
        // Initialize progress if starting a life story experience
        const state = get();
        if ((experience === 'simple_life_story' || experience === 'comprehensive_life_story') 
            && !state.experienceProgress[experience]) {
          const totalQuestions = experience === 'simple_life_story' ? 25 : 100;
          const totalChapters = experience === 'simple_life_story' ? 5 : 20;
          
          set({
            experienceProgress: {
              ...state.experienceProgress,
              [experience]: {
                experienceType: experience,
                currentChapter: 0,
                totalChapters,
                questionsAnswered: 0,
                totalQuestions,
                startedAt: Date.now(),
                lastActivityAt: Date.now(),
              }
            }
          });
        }
      },
      
      updateProgress: (experienceType, updates) => set((state) => ({
        experienceProgress: {
          ...state.experienceProgress,
          [experienceType]: state.experienceProgress[experienceType] 
            ? { ...state.experienceProgress[experienceType]!, ...updates }
            : null,
        }
      })),
      
      getCurrentQuestion: (experienceType) => {
        if (experienceType === 'daily') return null; // Daily uses AI generation
        
        const state = get();
        const progress = state.experienceProgress[experienceType];
        if (!progress) return null;
        
        // This would return the next question based on progress
        // For now, return null to use AI generation
        return null;
      },
      
      markQuestionAnswered: (experienceType) => {
        const state = get();
        const progress = state.experienceProgress[experienceType];
        if (!progress) return;
        
        const newQuestionsAnswered = progress.questionsAnswered + 1;
        const newChapter = Math.floor(newQuestionsAnswered / (progress.totalQuestions / progress.totalChapters));
        
        set({
          experienceProgress: {
            ...state.experienceProgress,
            [experienceType]: {
              ...progress,
              questionsAnswered: newQuestionsAnswered,
              currentChapter: Math.min(newChapter, progress.totalChapters - 1),
              lastActivityAt: Date.now(),
            }
          }
        });
      },
      
      resetExperience: (experienceType) => set((state) => ({
        experienceProgress: {
          ...state.experienceProgress,
          [experienceType]: null,
        }
      })),
    }),
    {
      name: 'experience-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);