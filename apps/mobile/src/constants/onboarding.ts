/**
 * Constantes d'onboarding Flowli Mobile
 * URLs et contenus modifiables
 */

// URLs externes
export const ONBOARDING_LINKS = {
  calendly: 'https://cal.com/erwan-dehu/30min',
  whatsapp: 'https://wa.me/33698446548?text=Salut%2C%20je%20veux%20parler%20de%20mon%20app%20!',
  email: 'mailto:contact@flowli.fr',
  phone: 'tel:+33698446548',
} as const;

// Contenus textuels
export const ONBOARDING_CONTENT = {
  hero: {
    badge: '+50 entreprises nous ont fait confiance',
    title: "On crée l'application sur-mesure pour ton entreprise en 14 jours.",
    subtitle: 'Notre mission : Créer une app qui convertit satisfaction en',
    subtitleHighlight1: 'CA récurrent',
    subtitleEnd: 'et',
    subtitleHighlight2: 'LTV qui grimpe',
  },
  arguments: [
    { icon: 'Clock', text: 'Intuitive' },
    { icon: 'CheckCircle', text: 'Retours illimités' },
    { icon: 'Shield', text: 'Brandé' },
  ],
  cta: {
    primary: 'Réserver un appel',
    secondary: 'Nous contacter',
    login: 'Se connecter',
  },
  benefits: [
    {
      icon: 'Clock',
      title: 'Livré en 14j',
      description: 'Rapidité garantie',
    },
    {
      icon: 'CheckCircle',
      title: 'Retours illimités',
      description: "Jusqu'à satisfaction",
    },
    {
      icon: 'TrendingUp',
      title: 'Augmente ta LTV',
      description: 'ROI mesurable',
    },
    {
      icon: 'Zap',
      title: "Sors de l'opérationnel",
      description: 'Automatisation complète',
    },
  ],
  features: {
    title: 'Ton application sur-mesure pour ton entreprise prête en 14 jours',
    items: [
      'UI intuitive & 100% brandée',
      'Notifications intelligentes : client & équipe',
      'Espace client 24/7 (docs, messages, livrables…)',
      "Parcours fluide de l'onboarding à la facturation",
      'Connectée à ton CRM/ERP',
    ],
  },
  social: {
    title: 'Ils nous font confiance',
  },
  login: {
    prompt: 'Déjà client ?',
    cta: 'Se connecter',
  },
} as const;

// Logos clients (nom + texte si pas d'images)
export const CLIENT_LOGOS = [
  'Gyraya',
  'DLT First',
  'Crédit Conseil France',
  'Blackout',
  'Zine Avocats',
  'Group 15',
  'As des Jardins',
  'Revele',
  'Lec Media',
  'Flowli Partners',
  'Innovation Hub',
] as const;

