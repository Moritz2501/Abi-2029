/**
 * ABI-2029 Globale Konstanten
 */

export const SITE_NAME = 'ABI 2029';
export const SITE_DESCRIPTION = 'Offizielle Web-App für Abiturjahrgang 2029 des Maria-Wächtler Gymnasiums';
export const SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Roles
export const ROLES = {
  USER: 'USER',
  PLANUNG: 'PLANUNG',
  KASSE: 'KASSE',
  ADMIN: 'ADMIN',
  ROOT: 'ROOT',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  USER: 'Benutzer',
  PLANUNG: 'Planung',
  KASSE: 'Kassenverwaltung',
  ADMIN: 'Administrator',
  ROOT: 'Root Admin',
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  USER: 'Normaler Benutzer des Abiturjahrgangs',
  PLANUNG: 'Kann Veranstaltungen und Events planen',
  KASSE: 'Verwaltet die Abikasse und Finanzen',
  ADMIN: 'Volle Administratorrechte',
  ROOT: 'Oberster Admin mit vollständiger Kontrolle',
};

// Onboarding Status
export const ONBOARDING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const ONBOARDING_LABELS: Record<string, string> = {
  PENDING: 'Ausstehend',
  APPROVED: 'Bestätigt',
  REJECTED: 'Abgelehnt',
};

// Transactions
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

// UI
export const ANIMATION_DURATION = 0.3;
export const BLUR_VALUES = {
  sm: '4px',
  md: '12px',
  lg: '20px',
  xl: '40px',
};

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MAX_LENGTH = 20;

// Pagination
export const ITEMS_PER_PAGE = 10;

// Cache
export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
};
