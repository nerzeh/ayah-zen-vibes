import SubscriptionService from '@/services/subscriptionService';

// RevenueCat API Key - Replace with your actual RevenueCat API key
const REVENUECAT_API_KEY = 'your_revenuecat_api_key_here';

export const initializeRevenueCat = async () => {
  try {
    const subscriptionService = SubscriptionService.getInstance();
    await subscriptionService.initialize(REVENUECAT_API_KEY);
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    // In a real app, you might want to show a toast or handle this gracefully
  }
};

export default initializeRevenueCat;