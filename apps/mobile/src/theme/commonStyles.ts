/**
 * Common Styles - Flowli
 * Styles standardisés réutilisables basés sur la DA de l'onboarding
 */

import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { tokens } from './tokens';

/**
 * Styles de cards standardisés
 */
export const cardStyles = StyleSheet.create({
  default: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[6],
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  compact: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius['2xl'],
    padding: tokens.spacing[4],
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
});

/**
 * Styles de headers standardisés
 */
export const headerStyles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing[6],
  },
  title: {
    fontSize: tokens.font.sizes.h2,
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[1],
  },
  titleAccent: {
    color: tokens.colors.primary,
  },
  subtitle: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
  },
});

/**
 * Styles de boutons standardisés
 */
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: tokens.colors.primaryForeground,
    fontWeight: tokens.font.weights.semibold,
    fontSize: tokens.font.sizes.sm,
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
  },
  secondaryText: {
    color: tokens.colors.foregroundLight,
    fontWeight: tokens.font.weights.semibold,
    fontSize: tokens.font.sizes.sm,
    textAlign: 'center',
  },
  destructive: {
    backgroundColor: tokens.colors.backgroundLight,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing[4],
    paddingVertical: tokens.spacing[2],
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  destructiveText: {
    color: tokens.colors.destructiveDark,
    fontWeight: tokens.font.weights.semibold,
    fontSize: tokens.font.sizes.sm,
    textAlign: 'center',
  },
});

/**
 * Styles d'inputs standardisés
 */
export const inputStyles = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    borderRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing[3] + 2, // 14px
    paddingVertical: tokens.spacing[3],
    fontSize: tokens.font.sizes.sm,
    backgroundColor: tokens.colors.mutedLight,
    color: tokens.colors.foregroundLight,
  },
  label: {
    fontSize: tokens.font.sizes.sm,
    fontWeight: tokens.font.weights.medium,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[2],
  },
  error: {
    borderColor: tokens.colors.destructiveLight,
  },
  errorText: {
    fontSize: tokens.font.sizes.xs,
    color: tokens.colors.destructiveDark,
    marginTop: tokens.spacing[1],
  },
});

/**
 * Styles de badges standardisés
 */
export const badgeStyles = StyleSheet.create({
  base: {
    paddingHorizontal: tokens.spacing[3],
    paddingVertical: tokens.spacing[1] + 2, // 6px
    borderRadius: tokens.radius.full,
    borderWidth: 1,
  },
  success: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  successText: {
    color: '#166534',
    fontSize: tokens.font.sizes.xs,
    fontWeight: tokens.font.weights.semibold,
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: tokens.font.sizes.xs,
    fontWeight: tokens.font.weights.semibold,
  },
  primary: {
    backgroundColor: '#F5F3FF',
    borderColor: '#C4B5FD',
  },
  primaryText: {
    color: tokens.colors.primary,
    fontSize: tokens.font.sizes.xs,
    fontWeight: tokens.font.weights.semibold,
  },
  default: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  defaultText: {
    color: '#6B7280',
    fontSize: tokens.font.sizes.xs,
    fontWeight: tokens.font.weights.semibold,
  },
});

/**
 * Helper pour créer un style de shadow personnalisé
 */
export const createShadow = (color: string, opacity: number = 0.1, radius: number = 8, elevation: number = 3) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

/**
 * Styles de layout communs
 */
export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.mutedLight,
  },
  scrollContent: {
    padding: tokens.spacing[4],
  },
  section: {
    marginBottom: tokens.spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing[3],
    paddingHorizontal: tokens.spacing[1],
  },
  sectionTitle: {
    fontSize: tokens.font.sizes.lg,
    fontWeight: tokens.font.weights.bold,
    color: tokens.colors.foregroundLight,
  },
});

/**
 * Empty states standardisés
 */
export const emptyStateStyles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.backgroundLight,
    padding: tokens.spacing[8],
    borderRadius: tokens.radius['2xl'],
    borderWidth: 1,
    borderColor: tokens.colors.borderLight,
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.font.sizes.md,
    fontWeight: tokens.font.weights.semibold,
    color: tokens.colors.foregroundLight,
    marginBottom: tokens.spacing[1],
  },
  subtitle: {
    fontSize: tokens.font.sizes.sm,
    color: tokens.colors.mutedForegroundLight,
    textAlign: 'center',
  },
});

