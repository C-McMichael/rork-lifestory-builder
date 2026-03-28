import { Plan } from '@/types/plans';

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    description: 'Perfect for getting started',
    features: [
      '3 questions per week',
      'Basic transcription',
      'Photo uploads',
      'Simple journal entries'
    ]
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    price: 9.99,
    interval: 'monthly',
    description: 'Unlimited journaling experience',
    isPopular: true,
    features: [
      'Unlimited daily questions',
      'AI-powered transcription',
      'Unlimited photo uploads',
      'Advanced journal features',
      'Book creation',
      'Export to PDF',
      'Priority support'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'Premium',
    price: 99.99,
    interval: 'yearly',
    description: 'Best value - 2 months free',
    features: [
      'Unlimited daily questions',
      'AI-powered transcription',
      'Unlimited photo uploads',
      'Advanced journal features',
      'Book creation',
      'Export to PDF',
      'Priority support',
      '2 months free'
    ]
  }
];