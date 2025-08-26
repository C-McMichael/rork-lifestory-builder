import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useJournalStore } from '@/store/journalStore';

export default function CreateBookScreen() {
  const { entries } = useJournalStore();
  const [title, setTitle] = useState('My Life Journal');
  const [selectedEntries, setSelectedEntries] = useState<string[]>(
    entries.map(entry => entry.id)
  );
  const [includeImages, setIncludeImages] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(true);
  
  const handleToggleEntry = (entryId: string) => {
    if (selectedEntries.includes(entryId)) {
      setSelectedEntries(selectedEntries.filter(id => id !== entryId));
    } else {
      setSelectedEntries([...selectedEntries, entryId]);
    }
  };
  
  const handleCreateBook = () => {
    if (selectedEntries.length === 0) {
      Alert.alert('No Entries Selected', 'Please select at least one entry for your book.');
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your book.');
      return;
    }
    
    // In a real app, this would create a book order
    Alert.alert(
      'Book Created',
      'Your book has been created and will be processed. You can check the status in the Orders section.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Book',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book Title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title"
            maxLength={50}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Entries</Text>
          <Text style={styles.sectionDescription}>
            Choose which journal entries to include in your book.
          </Text>
          
          {entries.map(entry => {
            const date = new Date(entry.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            
            return (
              <View key={entry.id} style={styles.entryItem}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryDate}>{formattedDate}</Text>
                  <Text style={styles.entryQuestion} numberOfLines={1}>
                    {entry.question}
                  </Text>
                </View>
                <Switch
                  value={selectedEntries.includes(entry.id)}
                  onValueChange={() => handleToggleEntry(entry.id)}
                  trackColor={{ false: Colors.light.gray, true: Colors.light.primary }}
                  thumbColor="#fff"
                />
              </View>
            );
          })}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book Options</Text>
          
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Include Images</Text>
            <Switch
              value={includeImages}
              onValueChange={setIncludeImages}
              trackColor={{ false: Colors.light.gray, true: Colors.light.primary }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Include QR Codes for Audio</Text>
            <Switch
              value={includeAudio}
              onValueChange={setIncludeAudio}
              trackColor={{ false: Colors.light.gray, true: Colors.light.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreateBook}
        >
          <Check size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create Book</Text>
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your book will be professionally printed and shipped to your address.
            Standard shipping takes 7-10 business days.
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
  headerButton: {
    marginLeft: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.gray,
    borderRadius: 8,
    padding: 12,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  entryInfo: {
    flex: 1,
    marginRight: 12,
  },
  entryDate: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: 4,
  },
  entryQuestion: {
    fontSize: 16,
    color: Colors.light.text,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    margin: 16,
    borderRadius: 30,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 8,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
});