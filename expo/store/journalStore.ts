import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, BookOrder } from '@/types/journal';

interface JournalState {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  bookOrders: BookOrder[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  setCurrentEntry: (entry: JournalEntry | null) => void;
  addBookOrder: (order: BookOrder) => void;
  updateBookOrder: (id: string, updates: Partial<BookOrder>) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      currentEntry: null,
      bookOrders: [],
      
      addEntry: (entry) => set((state) => ({
        entries: [entry, ...state.entries],
      })),
      
      updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map((entry) => 
          entry.id === id ? { ...entry, ...updates } : entry
        ),
        currentEntry: state.currentEntry?.id === id 
          ? { ...state.currentEntry, ...updates } 
          : state.currentEntry,
      })),
      
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        currentEntry: state.currentEntry?.id === id ? null : state.currentEntry,
      })),
      
      setCurrentEntry: (entry) => set({ currentEntry: entry }),
      
      addBookOrder: (order) => set((state) => ({
        bookOrders: [order, ...state.bookOrders],
      })),
      
      updateBookOrder: (id, updates) => set((state) => ({
        bookOrders: state.bookOrders.map((order) => 
          order.id === id ? { ...order, ...updates } : order
        ),
      })),
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);