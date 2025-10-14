/**
 * Motion constants and React Native Easing helpers
 */
import { Easing } from 'react-native';
import { tokens } from './tokens';

export const durations = tokens.motion.durations;

export const easings = {
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  in: Easing.bezier(0.4, 0, 1, 1),
  out: Easing.bezier(0, 0, 0.2, 1),
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
};

export type EasingName = keyof typeof easings;

