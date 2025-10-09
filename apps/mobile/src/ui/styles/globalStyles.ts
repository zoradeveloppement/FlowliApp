/**
 * DEPRECATED: This file is being phased out in favor of Tailwind/NativeWind classes.
 * Use Tailwind classes directly in components instead.
 * 
 * Color mappings:
 * - colors.primary → bg-primary, text-primary
 * - colors.bgGray → bg-bgGray
 * - colors.textMain → text-textMain
 * - colors.textMuted → text-textMuted
 * - colors.success → bg-success, text-success
 * - colors.warn → bg-warn, text-warn
 * - colors.danger → bg-danger, text-danger
 * 
 * Typography mappings:
 * - typography.h1 → text-h1
 * - typography.h2 → text-h2
 * - typography.body → text-body
 * - typography.secondary → text-secondary
 * - typography.button → text-button
 * 
 * Spacing mappings:
 * - spacing.xs → p-1, m-1, gap-1
 * - spacing.sm → p-2, m-2, gap-2
 * - spacing.md → p-4, m-4, gap-4
 * - spacing.lg → p-6, m-6, gap-6
 * - spacing.xl → p-8, m-8, gap-8
 * - spacing.xxl → p-12, m-12, gap-12
 * 
 * Border radius mappings:
 * - borderRadius.sm → rounded-sm
 * - borderRadius.md → rounded-md
 * - borderRadius.lg → rounded-lg
 * - borderRadius.xl → rounded-xl
 * - borderRadius.full → rounded-full
 * 
 * Shadow mappings:
 * - shadows.card → shadow-card
 * - shadows.button → shadow-button
 * 
 * This file is kept temporarily for reference during migration.
 * All new components should use Tailwind classes directly.
 */

import { StyleSheet } from 'react-native';

// Design tokens basés sur votre charte UX/UI
export const colors = {
  primary: '#6C63FF',
  primaryLight: '#B3B0FF',
  bgLight: '#FFFFFF',
  bgGray: '#F7F8FA',
  textMain: '#1A1A1A',
  textMuted: '#6E6E6E',
  success: '#4CAF50',
  warn: '#FF9800',
  danger: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F7F8FA',
    200: '#E0E0E0',
    300: '#BDBDBD',
    400: '#9E9E9E',
    500: '#6E6E6E',
    600: '#424242',
    700: '#1A1A1A',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  secondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  button: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

// Styles globaux
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgGray,
  },
  screen: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  screenWeb: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    maxWidth: 800,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    ...shadows.button,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    fontSize: typography.body.fontSize,
  },
  inputFocused: {
    borderColor: colors.primary,
    ...shadows.button,
  },
  inputError: {
    borderColor: colors.danger,
  },
  text: {
    color: colors.textMain,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  textMuted: {
    color: colors.textMuted,
    fontSize: typography.secondary.fontSize,
    lineHeight: typography.secondary.lineHeight,
  },
  textPrimary: {
    color: colors.primary,
  },
  textSuccess: {
    color: colors.success,
  },
  textDanger: {
    color: colors.danger,
  },
  textWarn: {
    color: colors.warn,
  },
  textWhite: {
    color: colors.white,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column',
  },
  itemsCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  spaceY: {
    marginVertical: spacing.sm,
  },
  spaceX: {
    marginHorizontal: spacing.sm,
  },
});
