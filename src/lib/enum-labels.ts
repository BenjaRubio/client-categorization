import type {
  WeeklyVolume,
  UseCase,
  Industry,
  AwarenessChannel,
  Seasonality,
  IntegrationLevel,
  Urgency,
} from '@prisma/client';

export const WEEKLY_VOLUME_LABELS: Record<WeeklyVolume, string> = {
  RANGE_0_100: '0 – 100',
  RANGE_101_500: '101 – 500',
  RANGE_501_2000: '501 – 2.000',
  RANGE_2000_PLUS: '2.000+',
  UNDEFINED: 'No definido',
};

export const USE_CASE_LABELS: Record<UseCase, string> = {
  CUSTOMER_SERVICE: 'Atención al cliente',
  SCHEDULING: 'Agendamiento',
  TECHNICAL_SUPPORT: 'Soporte técnico',
  ADS: 'Publicidad',
  OTHER: 'Otro',
};

export const INDUSTRY_LABELS: Record<Industry, string> = {
  FINANCE: 'Finanzas',
  HEALTHCARE: 'Salud',
  ECOMMERCE_AND_RETAIL: 'E-commerce y Retail',
  EDUCATION: 'Educación',
  LOGISTICS: 'Logística',
  REAL_ESTATE: 'Bienes raíces',
  LEGAL: 'Legal',
  HOSPITALITY_AND_TOURISM: 'Hotelería y Turismo',
  TELECOMMUNICATIONS: 'Telecomunicaciones',
  GASTRONOMY: 'Gastronomía',
  AUTOMOTIVE: 'Automotriz',
  AGRICULTURE: 'Agricultura',
  PROFESSIONAL_SERVICES: 'Servicios profesionales',
  MEDIA_AND_ENTERTAINMENT: 'Medios y Entretenimiento',
  NON_PROFIT: 'Sin fines de lucro',
  TECHNOLOGY: 'Tecnología',
  ENERGY: 'Energía',
  CONSTRUCTION: 'Construcción',
  ART_AND_DESIGN: 'Arte y Diseño',
};

export const AWARENESS_CHANNEL_LABELS: Record<AwarenessChannel, string> = {
  INTERNET_SEARCH: 'Búsqueda en internet',
  NETWORKING: 'Networking',
  FAMILY_FRIEND: 'Familiar o amigo',
  SOCIAL_NETWORK_ADS: 'Redes sociales (ads)',
  WEBINARS_TALKS: 'Webinars / Charlas',
  FAIR: 'Feria',
  LINKEDIN: 'LinkedIn',
  PODCASTS: 'Podcasts',
  OTHER: 'Otro',
};

export const SEASONALITY_LABELS: Record<Seasonality, string> = {
  CONSTANT: 'Constante',
  SEASONAL: 'Estacional',
  UNDEFINED: 'No definido',
};

export const INTEGRATION_LEVEL_LABELS: Record<IntegrationLevel, string> = {
  LOW: 'Bajo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
};
