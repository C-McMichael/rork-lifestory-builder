import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { Image } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, Download, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useJournalStore } from '@/store/journalStore';
import { formatAudioDuration } from '@/utils/audioUtils';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, deleteEntry } = useJournalStore();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const entry = entries.find(e => e.id === id);
  
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);
  
  useEffect(() => {
    if (entry?.audioUri) {
      loadAudio();
    }
  }, [entry?.audioUri]);
  
  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entry not found</Text>
      </View>
    );
  }
  
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const loadAudio = async () => {
    if (!entry.audioUri) return;
    
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: entry.audioUri },
        { shouldPlay: false }
      );
      
      setSound(newSound);
      
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Failed to load audio', error);
    }
  };
  
  const handlePlayPause = async () => {
    if (!sound) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to play/pause audio', error);
    }
  };
  
  const handleDownload = () => {
    // In a real app, this would download the entry as a PDF
    Alert.alert(
      'Download Entry',
      'This would download your journal entry as a PDF in a real app.'
    );
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteEntry(entry.id);
            router.back();
          } 
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Journal Entry',
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Trash2 size={20} color={Colors.light.error} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.question}>{entry.question}</Text>
        
        {entry.audioUri && (
          <View style={styles.audioPlayer}>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={24} color={Colors.light.primary} />
              ) : (
                <Play size={24} color={Colors.light.primary} />
              )}
            </TouchableOpacity>
            <Text style={styles.durationText}>
              {formatAudioDuration(duration)}
            </Text>
          </View>
        )}
        
        {entry.transcription && (
          <View style={styles.transcriptionContainer}>
            <Text style={styles.transcriptionLabel}>Transcription</Text>
            <Text style={styles.transcriptionText}>{entry.transcription}</Text>
          </View>
        )}
        
        {entry.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.imagesLabel}>Photos</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesList}
            >
              {entry.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  {Platform.OS === 'web' ? (
                    <Image source={{ uri }} style={styles.image} />
                  ) : (
                    <ExpoImage source={{ uri }} style={styles.image} contentFit="cover" />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={handleDownload}
        >
          <Download size={20} color="#fff" />
          <Text style={styles.downloadButtonText}>Download as PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerButton: {
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: 8,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 24,
    lineHeight: 30,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: Colors.light.lightGray,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    marginRight: 16,
  },
  durationText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  transcriptionContainer: {
    marginBottom: 24,
  },
  transcriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
  imagesContainer: {
    marginBottom: 24,
  },
  imagesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  imagesList: {
    paddingVertical: 8,
  },
  imageWrapper: {
    marginRight: 12,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 40,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    textAlign: 'center',
  },
});