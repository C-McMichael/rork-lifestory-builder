import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Calendar, Book, Library, ArrowLeft, Clock, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { EXPERIENCES } from '@/constants/experiences';
import { useExperienceStore } from '@/store/experienceStore';
import { ExperienceType } from '@/types/experience';

const iconMap = {
  calendar: Calendar,
  book: Book,
  library: Library,
};

export default function ExperiencesScreen() {
  const { currentExperience, setCurrentExperience, experienceProgress } = useExperienceStore();

  const handleSelectExperience = (experienceType: ExperienceType) => {
    setCurrentExperience(experienceType);
    router.back();
  };

  const getProgressText = (experienceType: ExperienceType) => {
    const progress = experienceProgress[experienceType];
    if (!progress) return null;
    
    if (experienceType === 'daily') return null;
    
    const percentage = Math.round((progress.questionsAnswered / progress.totalQuestions) * 100);
    return `${progress.questionsAnswered}/${progress.totalQuestions} questions (${percentage}%)`;
  };

  const renderExperience = (experience: typeof EXPERIENCES[0]) => {
    const IconComponent = iconMap[experience.icon as keyof typeof iconMap];
    const isSelected = currentExperience === experience.id;
    const progress = experienceProgress[experience.id];
    const progressText = getProgressText(experience.id);
    const isCompleted = progress && progress.questionsAnswered >= progress.totalQuestions;

    return (
      <TouchableOpacity
        key={experience.id}
        style={[styles.experienceCard, isSelected && styles.selectedCard]}
        onPress={() => handleSelectExperience(experience.id)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
            <IconComponent size={24} color={isSelected ? '#fff' : Colors.light.primary} />
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <CheckCircle size={20} color={Colors.light.success} />
            </View>
          )}
        </View>
        
        <Text style={styles.experienceName}>{experience.name}</Text>
        <Text style={styles.experienceDescription}>{experience.description}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Clock size={16} color={Colors.light.darkGray} />
            <Text style={styles.detailText}>{experience.estimatedTime}</Text>
          </View>
          {experience.questionCount && (
            <Text style={styles.questionCount}>
              {experience.questionCount} questions
            </Text>
          )}
        </View>
        
        {progressText && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{progressText}</Text>
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
        
        <View style={styles.featuresContainer}>
          {experience.features.map((feature, index) => (
            <Text key={index} style={styles.featureText}>• {feature}</Text>
          ))}
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={[styles.selectText, isSelected && styles.selectedText]}>
            {isSelected ? 'Currently Selected' : 'Select Experience'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Choose Your Journey',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Journaling Journey</Text>
          <Text style={styles.subtitle}>
            Select the experience that matches your goals and available time
          </Text>
        </View>
        
        <View style={styles.experiencesContainer}>
          {EXPERIENCES.map(renderExperience)}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can switch between experiences at any time. Your progress will be saved.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerButton: {
    marginLeft: 8,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  experiencesContainer: {
    paddingHorizontal: 16,
  },
  experienceCard: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.light.primary,
    backgroundColor: '#fff',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  selectedIconContainer: {
    backgroundColor: Colors.light.primary,
  },
  completedBadge: {
    padding: 4,
  },
  experienceName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 16,
    color: Colors.light.darkGray,
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginLeft: 6,
  },
  questionCount: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
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
  featuresContainer: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardFooter: {
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  selectedText: {
    color: Colors.light.success,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});