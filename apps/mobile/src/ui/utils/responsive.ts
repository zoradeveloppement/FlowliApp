import { Dimensions, Platform } from 'react-native';

// Dimensions de l'écran
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  large: 1440,
} as const;

// Fonction pour détecter le type d'appareil
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (Platform.OS === 'web') {
    if (screenWidth >= BREAKPOINTS.desktop) return 'desktop';
    if (screenWidth >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  }
  
  // Sur mobile natif, on considère que c'est toujours mobile
  return 'mobile';
};

// Fonction pour vérifier si on est sur un écran large
export const isLargeScreen = (): boolean => {
  return screenWidth >= BREAKPOINTS.desktop;
};

// Fonction pour vérifier si on est sur une tablette
export const isTablet = (): boolean => {
  return getDeviceType() === 'tablet';
};

// Fonction pour vérifier si on est sur mobile
export const isMobile = (): boolean => {
  return getDeviceType() === 'mobile';
};

// Fonction pour obtenir les classes responsive
export const getResponsiveClasses = (classes: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return classes.desktop || classes.tablet || classes.mobile || '';
    case 'tablet':
      return classes.tablet || classes.mobile || '';
    case 'mobile':
    default:
      return classes.mobile || '';
  }
};

// Fonction pour obtenir la largeur maximale du contenu
export const getMaxContentWidth = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 1200;
    case 'tablet':
      return 768;
    case 'mobile':
    default:
      return screenWidth;
  }
};

// Fonction pour obtenir le padding horizontal approprié
export const getHorizontalPadding = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 24;
    case 'tablet':
      return 20;
    case 'mobile':
    default:
      return 16;
  }
};

// Fonction pour obtenir l'espacement vertical approprié
export const getVerticalSpacing = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 32;
    case 'tablet':
      return 28;
    case 'mobile':
    default:
      return 24;
  }
};

// Fonction pour obtenir le nombre de colonnes pour une grille
export const getGridColumns = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'desktop':
      return 3;
    case 'tablet':
      return 2;
    case 'mobile':
    default:
      return 1;
  }
};

// Fonction pour vérifier si on doit afficher la sidebar
export const shouldShowSidebar = (): boolean => {
  return Platform.OS === 'web' && isLargeScreen();
};

// Fonction pour vérifier si on doit afficher les bottom tabs
export const shouldShowBottomTabs = (): boolean => {
  return Platform.OS !== 'web' || !isLargeScreen();
};
