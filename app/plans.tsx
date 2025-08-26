import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Check, Crown, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PLANS } from '@/constants/plans';
import { usePlanStore } from '@/store/planStore';
import { Plan } from '@/types/plans';

export default function PlansScreen() {
  const { userPlan, setPlan } = usePlanStore();
  const [selectedPlan, setSelectedPlan] = useState<string>(userPlan?.planId || 'free');
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.id === userPlan?.planId) return;
    
    setLoading(true);
    
    try {
      if (plan.price === 0) {
        // Free plan - immediate activation
        setPlan({
          planId: plan.id,
          status: 'active',
          startedAt: Date.now(),
        });
        
        Alert.alert(
          'Plan Updated',
          'You are now on the Free plan.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        // Premium plan - simulate payment flow
        Alert.alert(
          'Upgrade to Premium',
          `You are about to subscribe to ${plan.name} for $${plan.price}/${plan.interval}. This would normally open the payment flow.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Subscribe', 
              onPress: () => {
                setPlan({
                  planId: plan.id,
                  status: 'active',
                  startedAt: Date.now(),
                  expiresAt: Date.now() + (plan.interval === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000,
                });
                
                Alert.alert(
                  'Welcome to Premium!',
                  'Your subscription is now active. Enjoy unlimited journaling!',
                  [{ text: 'OK', onPress: () => router.back() }]
                );
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      Alert.alert('Error', 'Failed to update your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlan = (plan: Plan) => {
    const isCurrentPlan = plan.id === userPlan?.planId;
    const isSelected = plan.id === selectedPlan;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          plan.isPopular && styles.popularPlan,
        ]}
        onPress={() => setSelectedPlan(plan.id)}
        disabled={loading}
      >
        {plan.isPopular && (
          <View style={styles.popularBadge}>
            <Crown size={16} color="#fff" />
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {plan.price === 0 ? 'Free' : `$${plan.price}`}
            </Text>
            {plan.price > 0 && (
              <Text style={styles.interval}>/{plan.interval}</Text>
            )}
          </View>
        </View>
        
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={16} color={Colors.light.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.selectButton,
            isCurrentPlan && styles.currentPlanButton,
            isSelected && !isCurrentPlan && styles.selectedButton,
          ]}
          onPress={() => handleSelectPlan(plan)}
          disabled={loading || isCurrentPlan}
        >
          <Text style={[
            styles.selectButtonText,
            isCurrentPlan && styles.currentPlanButtonText,
            isSelected && !isCurrentPlan && styles.selectedButtonText,
          ]}>
            {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Choose Your Plan',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select the plan that best fits your journaling needs
          </Text>
        </View>
        
        <View style={styles.plansContainer}>
          {PLANS.map(renderPlan)}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All plans include secure cloud storage and data export. Cancel anytime.
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
  contentContainer: {
    paddingBottom: 40,
  },
  headerButton: {
    marginLeft: 8,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
  plansContainer: {
    paddingHorizontal: 16,
  },
  planCard: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: Colors.light.primary,
    backgroundColor: '#fff',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularPlan: {
    borderColor: Colors.light.secondary,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: Colors.light.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  interval: {
    fontSize: 16,
    color: Colors.light.darkGray,
  },
  planDescription: {
    fontSize: 16,
    color: Colors.light.darkGray,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
  },
  selectButton: {
    backgroundColor: Colors.light.gray,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: Colors.light.primary,
  },
  currentPlanButton: {
    backgroundColor: Colors.light.success,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  selectedButtonText: {
    color: '#fff',
  },
  currentPlanButtonText: {
    color: '#fff',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});