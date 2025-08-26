import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RefreshCw, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { generateQuestion } from '@/utils/aiUtils';
import { usePlanStore } from '@/store/planStore';
import { useExperienceStore } from '@/store/experienceStore';
import { EXPERIENCES } from '@/constants/experiences';
import PlanLimitModal from './PlanLimitModal';

interface QuestionCardProps {
  onQuestionGenerated: (question: string) => void;
}

export default function QuestionCard({ onQuestionGenerated }: QuestionCardProps) {
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  
  const { 
    canGenerateQuestion, 
    incrementQuestionUsage, 
    questionsUsedThisWeek,
    userPlan 
  } = usePlanStore();
  
  const { 
    currentExperience, 
    experienceProgress, 
    markQuestionAnswered 
  } = useExperienceStore();

  const fetchNewQuestion = async () => {
    if (!canGenerateQuestion()) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    try {
      const progress = experienceProgress[currentExperience];
      const chapterIndex = progress?.currentChapter;
      
      const newQuestion = await generateQuestion(currentExperience, chapterIndex);
      setQuestion(newQuestion);
      onQuestionGenerated(newQuestion);
      incrementQuestionUsage();
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, [currentExperience]);

  const isPremium = userPlan?.planId.includes('premium');
  const maxQuestions = isPremium ? Infinity : 3;
  const currentExp = EXPERIENCES.find(exp => exp.id === currentExperience);
  const progress = experienceProgress[currentExperience];

  const getProgressText = () => {
    if (!progress || currentExperience === 'daily') return null;
    
    const percentage = Math.round((progress.questionsAnswered / progress.totalQuestions) * 100);
    return `Progress: ${progress.questionsAnswered}/${progress.totalQuestions} (${percentage}%)`;
  };

  const getCurrentChapterText = () => {
    if (!progress || currentExperience === 'daily') return null;
    
    const chapterNames = currentExperience === 'simple_life_story' 
      ? ['Early Years', 'Growing Up', 'Teenage Years', 'Young Adulthood', 'Life Today']
      : ['Family Origins', 'Early Childhood', 'Elementary Years', 'Middle School', 'High School Years'];
    
    const currentChapterName = chapterNames[progress.currentChapter] || 'Current Chapter';
    return `Chapter ${progress.currentChapter + 1}: ${currentChapterName}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Generating your question...</Text>
          </View>
        ) : (
          <>
            <View style={styles.headerRow}>
              <View style={styles.experienceInfo}>
                <Text style={styles.experienceLabel}>{currentExp?.name}</Text>
                {getCurrentChapterText() && (
                  <Text style={styles.chapterText}>{getCurrentChapterText()}</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => router.push('/experiences')}
              >
                <Settings size={20} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            
            {getProgressText() && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{getProgressText()}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(progress!.questionsAnswered / progress!.totalQuestions) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            {!isPremium && currentExperience === 'daily' && (
              <Text style={styles.usageText}>
                {questionsUsedThisWeek}/{maxQuestions} this week
              </Text>
            )}
            
            <Text style={styles.questionText}>{question}</Text>
            
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={fetchNewQuestion}
              disabled={loading}
            >
              <RefreshCw size={18} color={Colors.light.primary} />
              <Text style={styles.refreshText}>New Question</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      <PlanLimitModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        questionsUsed={questionsUsedThisWeek}
        maxQuestions={maxQuestions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  chapterText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: 2,
  },
  settingsButton: {
    padding: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.gray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  usageText: {
    fontSize: 12,
    color: Colors.light.primary,
    backgroundColor: Colors.light.gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 28,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.darkGray,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  refreshText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.light.primary,
  },
});