import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { router } from 'expo-router';
import { useJournalStore } from '@/store/journalStore';
import EntryCard from '@/components/EntryCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';

export default function JournalScreen() {
  const { entries } = useJournalStore();
  
  const handleEntryPress = (entryId: string) => {
    router.push(`/entry/${entryId}`);
  };

  if (entries.length === 0) {
    return (
      <EmptyState
        title="Your Journal is Empty"
        message="Start by recording your thoughts on the Today tab."
        actionLabel="Create First Entry"
        onAction={() => router.push('/')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard 
            entry={item} 
            onPress={() => handleEntryPress(item.id)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerText}>Your Journal Entries</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    color: Colors.light.darkGray,
    marginBottom: 16,
  },
});