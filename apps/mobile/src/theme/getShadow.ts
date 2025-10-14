/**
 * Platform-specific shadow resolver
 */
import { Platform, ViewStyle } from 'react-native';
import { tokens } from './tokens';

export type ShadowName = 'card' | 'primary' | 'hover' | 'premium' | 'premiumHover';

interface IOSShadow {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
}

interface AndroidShadow {
  elevation: number;
}

type ShadowStyle = IOSShadow | AndroidShadow;

/**
 * Parse shadow string to extract color, opacity, radius, and offset
 * Format: "0px 10px 30px rgba(124, 58, 237, 0.30)"
 */
function parseShadowString(shadowStr: string): IOSShadow {
  // Default fallback
  const defaultShadow: IOSShadow = {
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  };

  try {
    // Extract rgba values
    const rgbaMatch = shadowStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) {
      const [, r, g, b, a] = rgbaMatch;
      defaultShadow.shadowColor = `rgb(${r}, ${g}, ${b})`;
      defaultShadow.shadowOpacity = parseFloat(a);
    }

    // Extract offset and blur
    const numberMatch = shadowStr.match(/([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px/);
    if (numberMatch) {
      const [, offsetX, offsetY, blur] = numberMatch;
      defaultShadow.shadowOffset = {
        width: parseFloat(offsetX),
        height: parseFloat(offsetY),
      };
      defaultShadow.shadowRadius = parseFloat(blur) / 2;
    }
  } catch (e) {
    // Return default on parse error
    console.warn('Shadow parse error, using defaults:', e);
  }

  return defaultShadow;
}

/**
 * Get platform-specific shadow style
 */
export function getShadow(name: ShadowName): ViewStyle {
  const shadowString = tokens.shadow[name];

  if (Platform.OS === 'ios') {
    return parseShadowString(shadowString);
  }

  // Android elevation mapping
  const elevationMap: Record<ShadowName, number> = {
    card: 2,
    primary: 6,
    hover: 10,
    premium: 5,
    premiumHover: 8,
  };

  return {
    elevation: elevationMap[name],
  };
}

