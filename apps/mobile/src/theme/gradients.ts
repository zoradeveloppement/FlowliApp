/**
 * Gradient helpers for expo-linear-gradient
 */
import { tokens } from './tokens';

export interface GradientProps {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

/**
 * Hero gradient (135deg diagonal)
 */
export function getHeroGradient(): GradientProps {
  return {
    colors: tokens.gradients.hero,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };
}

/**
 * Card gradient (145deg diagonal)
 */
export function getCardGradient(): GradientProps {
  return {
    colors: tokens.gradients.card,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };
}

/**
 * Premium gradient (145deg diagonal)
 */
export function getPremiumGradient(): GradientProps {
  return {
    colors: tokens.gradients.premium,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };
}

