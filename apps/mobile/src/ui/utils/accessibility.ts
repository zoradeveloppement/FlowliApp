import { Platform } from 'react-native';

// Constantes d'accessibilité
export const ACCESSIBILITY = {
  // Tailles minimales pour les éléments interactifs
  MIN_TOUCH_SIZE: 44,
  
  // Contraste minimum AA
  MIN_CONTRAST_RATIO: 4.5,
  
  // Rôles ARIA
  ROLES: {
    BUTTON: 'button',
    LINK: 'link',
    HEADING: 'header',
    IMAGE: 'image',
    TEXT: 'text',
    SEARCH: 'search',
    NAVIGATION: 'navigation',
    MAIN: 'main',
    BANNER: 'banner',
    CONTENTINFO: 'contentinfo',
  },
  
  // Labels d'accessibilité
  LABELS: {
    CLOSE: 'Fermer',
    BACK: 'Retour',
    NEXT: 'Suivant',
    PREVIOUS: 'Précédent',
    MENU: 'Menu',
    SEARCH: 'Rechercher',
    FILTER: 'Filtrer',
    SORT: 'Trier',
    LOADING: 'Chargement en cours',
    ERROR: 'Erreur',
    SUCCESS: 'Succès',
    INFO: 'Information',
  },
} as const;

// Fonction pour vérifier le contraste des couleurs
export const getContrastRatio = (color1: string, color2: string): number => {
  // Implémentation simplifiée - dans une vraie app, utiliser une lib comme color-contrast
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Fonction pour générer des IDs uniques pour l'accessibilité
export const generateAccessibilityId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Fonction pour créer des props d'accessibilité
export const createAccessibilityProps = (options: {
  role?: string;
  label?: string;
  hint?: string;
  state?: {
    selected?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    checked?: boolean;
  };
  value?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
}) => {
  const props: any = {};

  if (options.role) {
    props.accessibilityRole = options.role;
  }

  if (options.label) {
    props.accessibilityLabel = options.label;
  }

  if (options.hint) {
    props.accessibilityHint = options.hint;
  }

  if (options.state) {
    if (options.state.selected !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, selected: options.state.selected };
    }
    if (options.state.disabled !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, disabled: options.state.disabled };
    }
    if (options.state.expanded !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, expanded: options.state.expanded };
    }
    if (options.state.checked !== undefined) {
      props.accessibilityState = { ...props.accessibilityState, checked: options.state.checked };
    }
  }

  if (options.value) {
    props.accessibilityValue = options.value;
  }

  return props;
};

// Fonction pour vérifier si on est sur une plateforme qui supporte l'accessibilité avancée
export const supportsAdvancedAccessibility = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

// Fonction pour créer des annonces d'accessibilité
export const createAccessibilityAnnouncement = (message: string) => {
  if (Platform.OS === 'ios') {
    // Sur iOS, utiliser AccessibilityInfo
    return message;
  }
  return message;
};
