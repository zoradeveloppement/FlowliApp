/**
 * Flowli Design Tokens
 * Source of truth for all design values from the Flowli charter
 */

export const tokens = {
  colors: {
    // Primary colors
    primary: "#7C3AED",
    primaryLight: "#A78BFA",
    primaryGlow: "#DDD6FE",
    primaryForeground: "#FFFFFF",
    
    // Light mode
    backgroundLight: "#FFFFFF",
    foregroundLight: "#181C25",
    cardLight: "#FFFFFF",
    mutedLight: "#F4F5F6",
    mutedForegroundLight: "#6B7280",
    borderLight: "#E5E7EB",
    inputLight: "#E5E7EB",
    
    // Dark mode
    backgroundDark: "#181C25",
    foregroundDark: "#FFFFFF",
    cardDark: "#181C25",
    mutedDark: "#23272F",
    mutedForegroundDark: "#9CA3AF",
    borderDark: "#23272F",
    inputDark: "#23272F",
    
    // Semantic colors
    destructiveLight: "#F87171",
    destructiveDark: "#DC2626",
    success: "#25D366",
    ring: "#7C3AED",
  },
  
  font: {
    family: {
      primary: "System",
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      h3: 24,
      h2: 36,
      h1: 60,
      heroMobile: 24,
      heroDesktop: 72,
    },
    weights: {
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
      extrabold: "800" as const,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      hero: 1.06,
    },
    letterSpacings: {
      tight: -0.02,
      normal: 0,
      wide: 0.01,
    },
  },
  
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    6: 24,
    8: 32,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },
  
  radius: {
    none: 0,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
    "3xl": 24,
    full: 9999,
  },
  
  // Shadow strings for iOS parsing
  shadow: {
    primary: "0px 10px 30px rgba(124, 58, 237, 0.30)",
    card: "0px 4px 6px rgba(229, 231, 235, 0.10), 0px 2px 4px rgba(229, 231, 235, 0.06)",
    hover: "0px 20px 40px rgba(124, 58, 237, 0.25)",
    premium: "0px 8px 25px rgba(124, 58, 237, 0.15)",
    premiumHover: "0px 15px 35px rgba(124, 58, 237, 0.25)",
  },
  
  // Gradient color stops for LinearGradient
  gradients: {
    hero: ["#7C3AED", "#B57CFF"],
    card: ["#FFFFFF", "#F6F8FA"],
    premium: ["#FFFFFF", "#F2EBFF"],
  },
  
  motion: {
    durations: {
      fast: 150,
      normal: 200,
      smooth: 300,
      slow: 600,
      typing: 800,
    },
    easings: {
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

export type Tokens = typeof tokens;

