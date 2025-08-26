import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    // In a real app, you would send the audio file to a transcription service
    // For this example, we'll simulate a response after a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulated transcription result
    return "This is a simulated transcription of your audio recording. In a real app, this would be the actual text from your voice recording.";
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

export const getAudioFileInfo = async (fileUri: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo;
  } catch (error) {
    console.error('Error getting audio file info:', error);
    throw error;
  }
};

export const formatAudioDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getAudioDirectory = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    return '';
  }
  
  const audioDir = `${FileSystem.documentDirectory}audio/`;
  const dirInfo = await FileSystem.getInfoAsync(audioDir);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
  }
  
  return audioDir;
};