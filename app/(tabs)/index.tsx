import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useJournalStore } from '@/store/journalStore';
import { useExperienceStore } from '@/store/experienceStore';
import QuestionCard from '@/components/QuestionCard';
import AudioRecorder from '@/components/AudioRecorder';
import ImagePickerComponent from '@/components/ImagePicker';
import Colors from '@/constants/colors';
import { transcribeAudio } from '@/utils/audioUtils';

export default function HomeScreen() {
  const { addEntry } = useJournalStore();
  const { currentExperience, markQuestionAnswered } = useExperienceStore();
  const [question, setQuestion] = useState<string>('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const handleQuestionGenerated = (newQuestion: string) => {
    setQuestion(newQuestion);
  };

  const handleRecordingComplete = (uri: string) => {
    setAudioUri(uri);
  };

  const handleImagesSelected = (selectedImages: string[]) => {
    setImages(selectedImages);
  };

  const handleSave = async () => {
    if (!question) {
      Alert.alert('Missing Question', 'Please generate a question first.');
      return;
    }

    if (!audioUri) {
      Alert.alert('Missing Recording', 'Please record your answer before saving.');
      return;
    }

    setSaving(true);

    try {
      const entryId = Date.now().toString();
      
      // Add entry with processing state
      addEntry({
        id: entryId,
        question,
        audioUri,
        images,
        createdAt: Date.now(),
        isProcessing: true,
        experienceType: currentExperience,
      });

      // Mark question as answered for life story experiences
      if (currentExperience !== 'daily') {
        markQuestionAnswered(currentExperience);
      }

      // In a real app, you would upload the audio file to a server for transcription
      // For this example, we'll use a simulated transcription
      const transcription = await transcribeAudio(audioUri);
      
      // Update entry with transcription
      addEntry({
        id: entryId,
        question,
        audioUri,
        transcription,
        images,
        createdAt: Date.now(),
        isProcessing: false,
        experienceType: currentExperience,
      });

      // Reset form
      setAudioUri(null);
      setImages([]);
      
      // Navigate to the journal tab
      router.push('/journal');
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save your journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSubtitleText = () => {
    switch (currentExperience) {
      case 'simple_life_story':
        return 'Building your life story, one memory at a time';
      case 'comprehensive_life_story':
        return 'Creating your comprehensive autobiography';
      default:
        return 'Record your thoughts and memories';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.subtitle}>
        {getSubtitleText()}
      </Text>
      
      <QuestionCard onQuestionGenerated={handleQuestionGenerated} />
      
      <View style={styles.recorderContainer}>
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      </View>
      
      <ImagePickerComponent 
        images={images}
        onImagesSelected={handleImagesSelected}
      />
      
      <TouchableOpacity 
        style={[
          styles.saveButton, 
          (!audioUri || saving) && styles.saveButtonDisabled
        ]} 
        onPress={handleSave}
        disabled={!audioUri || saving}
      >
        {saving ? (
          <Text style={styles.saveButtonText}>Saving...</Text>
        ) : (
          <>
            <Check size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </>
        )}
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Your entries will be transcribed and saved to your journal.
          {currentExperience !== 'daily' && ' Progress will be tracked for your life story.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  recorderContainer: {
    marginVertical: 24,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.gray,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
});