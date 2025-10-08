export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'disabled';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type InputSize = 'sm' | 'md' | 'lg';

export type BadgeStatus = 'terminé' | 'en cours' | 'à venir' | 'action requise';

export type SnackbarType = 'success' | 'error' | 'info';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
