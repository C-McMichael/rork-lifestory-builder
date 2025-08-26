import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Image } from 'react-native';
import { ChevronRight, Mic, Calendar, Book, Library } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { JournalEntry } from '@/types/journal';

interface EntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

const experienceIcons = {
  daily: Calendar,
  simple_life_story: Book,
  comprehensive_life_story: Library,
};

export default function EntryCard({ entry, onPress }: EntryCardProps) {
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Truncate question if it's too long
  const truncatedQuestion = entry.question.length > 60
    ? `${entry.question.substring(0, 60)}...`
    : entry.question;

  const ExperienceIcon = experienceIcons[entry.experienceType || 'daily'];

  const getExperienceLabel = () => {
    switch (entry.experienceType) {
      case 'simple_life_story':
        return 'Life Story';
      case 'comprehensive_life_story':
        return 'Autobiography';
      default:
        return 'Daily';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{formattedDate}</Text>
          <View style={styles.experienceTag}>
            <ExperienceIcon size={12} color={Colors.light.primary} />
            <Text style={styles.experienceText}>{getExperienceLabel()}</Text>
          </View>
        </View>
        <Text style={styles.question}>{truncatedQuestion}</Text>
        
        <View style={styles.detailsRow}>
          {entry.audioUri && (
            <View style={styles.audioIndicator}>
              <Mic size={14} color={Colors.light.darkGray} />
              <Text style={styles.audioText}>Audio</Text>
            </View>
          )}
          
          {entry.isProcessing && (
            <Text style={styles.processingText}>Processing...</Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightContent}>
        {entry.images.length > 0 ? (
          Platform.OS === 'web' ? (
            <Image 
              source={{ uri: entry.images[0] }} 
              style={styles.thumbnail} 
            />
          ) : (
            <ExpoImage 
              source={{ uri: entry.images[0] }} 
              style={styles.thumbnail}
              contentFit="cover"
            />
          )
        ) : (
          <View style={styles.noImagePlaceholder} />
        )}
        <ChevronRight size={20} color={Colors.light.darkGray} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.light.darkGray,
  },
  experienceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  experienceText: {
    fontSize: 10,
    color: Colors.light.primary,
    marginLeft: 2,
    fontWeight: '600',
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gray,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  audioText: {
    fontSize: 12,
    color: Colors.light.darkGray,
    marginLeft: 4,
  },
  processingText: {
    fontSize: 12,
    color: Colors.light.primary,
    marginLeft: 8,
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.gray,
    marginBottom: 8,
  },
});