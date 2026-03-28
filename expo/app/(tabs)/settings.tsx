import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert, Platform } from 'react-native';
import { ChevronRight, Book, Download, Trash2, Crown, CreditCard } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useJournalStore } from '@/store/journalStore';
import { usePlanStore } from '@/store/planStore';
import { PLANS } from '@/constants/plans';

export default function SettingsScreen() {
  const { entries, bookOrders } = useJournalStore();
  const { userPlan } = usePlanStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  
  const currentPlan = PLANS.find(plan => plan.id === userPlan?.planId);
  const isPremium = userPlan?.planId.includes('premium');
  
  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleCreateBook = () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'Book creation is available for Premium subscribers only.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/plans') }
        ]
      );
      return;
    }
    
    if (entries.length === 0) {
      Alert.alert(
        'No Entries',
        'You need to create journal entries before you can create a book.'
      );
      return;
    }
    
    Alert.alert(
      'Create Book',
      'This will create a book with all your journal entries. You can customize it on the next screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          onPress: () => {
            // In a real app, this would navigate to a book creation screen
            Alert.alert('Book Creation', 'Book creation would start here in a real app.');
          } 
        },
      ]
    );
  };
  
  const handleExportData = () => {
    if (entries.length === 0) {
      Alert.alert(
        'No Data',
        'You have no journal entries to export.'
      );
      return;
    }
    
    // In a real app, this would export the data
    Alert.alert(
      'Export Data',
      'This would export all your journal entries as a file in a real app.'
    );
  };
  
  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all your journal entries? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete all data
            Alert.alert('Data Deleted', 'All data would be deleted in a real app.');
          } 
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Plan</Text>
        
        <TouchableOpacity style={styles.planItem} onPress={() => router.push('/plans')}>
          <View style={styles.planInfo}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{currentPlan?.name || 'Free'}</Text>
              {isPremium && <Crown size={16} color={Colors.light.secondary} />}
            </View>
            <Text style={styles.planDescription}>
              {currentPlan?.description || 'Basic journaling features'}
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.light.darkGray} />
        </TouchableOpacity>
        
        {!isPremium && (
          <TouchableOpacity style={styles.upgradeButton} onPress={() => router.push('/plans')}>
            <Crown size={20} color="#fff" />
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Daily Reminders</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: Colors.light.gray, true: Colors.light.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Book Creation</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleCreateBook}>
          <View style={styles.settingLabelContainer}>
            <Book size={20} color={Colors.light.text} style={styles.settingIcon} />
            <View>
              <Text style={styles.settingLabel}>Create a Book</Text>
              {!isPremium && (
                <Text style={styles.premiumBadge}>Premium</Text>
              )}
            </View>
          </View>
          <ChevronRight size={20} color={Colors.light.darkGray} />
        </TouchableOpacity>
        
        <Text style={styles.settingDescription}>
          Turn your journal entries into a beautiful printed book
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <View style={styles.settingLabelContainer}>
            <Download size={20} color={Colors.light.text} style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Export Data</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.darkGray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, styles.dangerItem]} 
          onPress={handleDeleteAllData}
        >
          <View style={styles.settingLabelContainer}>
            <Trash2 size={20} color={Colors.light.error} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, styles.dangerText]}>Delete All Data</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.darkGray} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Life Journal v1.0.0
        </Text>
        <Text style={styles.copyrightText}>
          © 2025 Life Journal App
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.text,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 8,
  },
  planDescription: {
    fontSize: 14,
    color: Colors.light.darkGray,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 30,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  premiumBadge: {
    fontSize: 12,
    color: Colors.light.secondary,
    backgroundColor: Colors.light.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginTop: 8,
  },
  dangerItem: {
    marginTop: 8,
  },
  dangerText: {
    color: Colors.light.error,
  },
  aboutText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 14,
    color: Colors.light.darkGray,
  },
});