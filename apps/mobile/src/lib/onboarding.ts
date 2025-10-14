import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_SEEN_KEY = '@flowli_onboarding_seen';

/**
 * Marque l'onboarding comme vu
 */
export const markOnboardingAsSeen = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch (error) {
    console.error('Error marking onboarding as seen:', error);
  }
};

/**
 * Vérifie si l'onboarding a déjà été vu
 */
export const hasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Réinitialise l'état de l'onboarding (utile pour le debug)
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_SEEN_KEY);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};

