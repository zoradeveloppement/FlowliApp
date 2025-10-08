import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { 
  ACCESSIBILITY, 
  createAccessibilityProps, 
  generateAccessibilityId,
  supportsAdvancedAccessibility 
} from '../utils/accessibility';

export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  useEffect(() => {
    if (supportsAdvancedAccessibility()) {
      // Vérifier si le lecteur d'écran est activé
      // Note: Dans une vraie app, utiliser AccessibilityInfo
      setIsScreenReaderEnabled(false);
      setIsReduceMotionEnabled(false);
    }
  }, []);

  const createButtonProps = (options: {
    label: string;
    hint?: string;
    disabled?: boolean;
    selected?: boolean;
  }) => {
    return createAccessibilityProps({
      role: ACCESSIBILITY.ROLES.BUTTON,
      label: options.label,
      hint: options.hint,
      state: {
        disabled: options.disabled,
        selected: options.selected,
      },
    });
  };

  const createLinkProps = (options: {
    label: string;
    hint?: string;
  }) => {
    return createAccessibilityProps({
      role: ACCESSIBILITY.ROLES.LINK,
      label: options.label,
      hint: options.hint,
    });
  };

  const createHeadingProps = (level: 1 | 2 | 3 | 4 | 5 | 6, label: string) => {
    return createAccessibilityProps({
      role: ACCESSIBILITY.ROLES.HEADING,
      label,
      value: { text: `Niveau ${level}` },
    });
  };

  const createImageProps = (options: {
    label: string;
    hint?: string;
  }) => {
    return createAccessibilityProps({
      role: ACCESSIBILITY.ROLES.IMAGE,
      label: options.label,
      hint: options.hint,
    });
  };

  const createNavigationProps = (label: string) => {
    return createAccessibilityProps({
      role: ACCESSIBILITY.ROLES.NAVIGATION,
      label,
    });
  };

  const createSearchProps = (label: string) => {
    return createAccessibilityProps({
      role: ACCESSIBILITY.ROLES.SEARCH,
      label,
    });
  };

  const announceToScreenReader = (message: string) => {
    if (isScreenReaderEnabled) {
      // Dans une vraie app, utiliser AccessibilityInfo.announceForAccessibility
      console.log('Screen reader announcement:', message);
    }
  };

  const focusElement = (elementId: string) => {
    if (Platform.OS === 'web' && isScreenReaderEnabled) {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
      }
    }
  };

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    createButtonProps,
    createLinkProps,
    createHeadingProps,
    createImageProps,
    createNavigationProps,
    createSearchProps,
    announceToScreenReader,
    focusElement,
    generateAccessibilityId,
  };
};
