import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Crown, X } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

interface PlanLimitModalProps {
  visible: boolean;
  onClose: () => void;
  questionsUsed: number;
  maxQuestions: number;
}

export default function PlanLimitModal({ 
  visible, 
  onClose, 
  questionsUsed, 
  maxQuestions 
}: PlanLimitModalProps) {
  const handleUpgrade = () => {
    onClose();
    router.push('/plans');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.light.darkGray} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Crown size={48} color={Colors.light.primary} />
          </View>
          
          <Text style={styles.title}>Question Limit Reached</Text>
          <Text style={styles.message}>
            You have used {questionsUsed} of {maxQuestions} questions this week on the Free plan.
          </Text>
          
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Crown size={20} color="#fff" />
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
          
          <Text style={styles.benefitsText}>
            Premium includes unlimited questions, AI transcription, and book creation
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.light.darkGray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: Colors.light.darkGray,
    fontSize: 16,
  },
  benefitsText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});