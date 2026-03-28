export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  description: string;
}

export interface UserPlan {
  planId: string;
  status: 'active' | 'inactive' | 'trial';
  expiresAt?: number;
  startedAt: number;
}