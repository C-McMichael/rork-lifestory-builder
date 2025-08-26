import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Mic, Square, Play, Pause } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getAudioDirectory, formatAudioDuration } from '@/utils/audioUtils';

interface AudioRecorderProps {
  onRecordingComplete: (uri: string) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
      if (recording) stopRecording();
      if (sound) sound.unloadAsync();
    };
  }, []);

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setRecordingDuration(0);
      
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1000);
      }, 1000);
      
      setTimer(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      if (timer) clearInterval(timer);
      setTimer(null);
      
      await recording.stopAndUnloadAsync();
      
      let uri = recording.getURI();
      if (!uri) throw new Error("Recording URI is undefined");
      
      if (Platform.OS !== 'web') {
        const audioDir = await getAudioDirectory();
        const fileName = `recording-${Date.now()}.m4a`;
        const newUri = `${audioDir}${fileName}`;
        
        // In a real app, you would move the file here
        // For this example, we'll just use the original URI
      }
      
      setAudioUri(uri);
      onRecordingComplete(uri);
      
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();
      setSound(sound);
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
    
    setRecording(null);
  };

  const playSound = async () => {
    if (!sound || !audioUri) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (err) {
      console.error('Failed to play sound', err);
    }
  };

  return (
    <View style={styles.container}>
      {!recording && !audioUri ? (
        <TouchableOpacity 
          style={styles.recordButton} 
          onPress={startRecording}
        >
          <Mic size={24} color="#fff" />
          <Text style={styles.recordButtonText}>Record Your Answer</Text>
        </TouchableOpacity>
      ) : recording ? (
        <View style={styles.recordingContainer}>
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>
              Recording... {formatAudioDuration(recordingDuration)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.stopButton} 
            onPress={stopRecording}
          >
            <Square size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.playbackContainer}>
          <Text style={styles.durationText}>
            {formatAudioDuration(duration)}
          </Text>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={playSound}
          >
            {isPlaying ? (
              <Pause size={24} color={Colors.light.primary} />
            ) : (
              <Play size={24} color={Colors.light.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.reRecordButton} 
            onPress={() => {
              if (sound) sound.unloadAsync();
              setSound(null);
              setAudioUri(null);
              setIsPlaying(false);
            }}
          >
            <Text style={styles.reRecordText}>Record Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    width: '100%',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.error,
    marginRight: 8,
  },
  recordingText: {
    color: Colors.light.text,
  },
  stopButton: {
    backgroundColor: Colors.light.error,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    width: '100%',
  },
  durationText: {
    color: Colors.light.text,
    marginRight: 12,
  },
  playButton: {
    backgroundColor: Colors.light.lightGray,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  reRecordButton: {
    marginLeft: 'auto',
  },
  reRecordText: {
    color: Colors.light.primary,
  },
});