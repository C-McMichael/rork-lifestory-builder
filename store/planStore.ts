import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPlan } from '@/types/plans';

interface PlanState {
  userPlan: UserPlan | null;
  questionsUsedThisWeek: number;
  weekStartDate: number;
  setPlan: (plan: UserPlan) => void;
  incrementQuestionUsage: () => void;
  canGenerateQuestion: () => boolean;
  resetWeeklyUsage: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      userPlan: {
        planId: 'free',
        status: 'active',
        startedAt: Date.now(),
      },
      questionsUsedThisWeek: 0,
      weekStartDate: Date.now(),
      
      setPlan: (plan) => set({ userPlan: plan }),
      
      incrementQuestionUsage: () => {
        const state = get();
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;
        
        // Reset weekly usage if a week has passed
        if (now - state.weekStartDate > weekInMs) {
          set({
            questionsUsedThisWeek: 1,
            weekStartDate: now,
          });
        } else {
          set({
            questionsUsedThisWeek: state.questionsUsedThisWeek + 1,
          });
        }
      },
      
      canGenerateQuestion: () => {
        const state = get();
        if (!state.userPlan) return false;
        
        // Premium users have unlimited questions
        if (state.userPlan.planId.includes('premium')) {
          return true;
        }
        
        // Free users get 3 questions per week
        return state.questionsUsedThisWeek < 3;
      },
      
      resetWeeklyUsage: () => set({
        questionsUsedThisWeek: 0,
        weekStartDate: Date.now(),
      }),
    }),
    {
      name: 'plan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);