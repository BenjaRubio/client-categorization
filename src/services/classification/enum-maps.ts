import {
  WeeklyVolume,
  UseCase,
  Industry,
  AwarenessChannel,
  Seasonality,
  IntegrationLevel,
  Urgency,
} from '@prisma/client';

export const WEEKLY_VOLUME: Record<string, WeeklyVolume> = {
  '0-100': 'RANGE_0_100',
  '101-500': 'RANGE_101_500',
  '501-2000': 'RANGE_501_2000',
  '2000+': 'RANGE_2000_PLUS',
  undefined: 'UNDEFINED',
};

export const USE_CASE: Record<string, UseCase> = {
  customer_service: 'CUSTOMER_SERVICE',
  scheduling: 'SCHEDULING',
  technical_support: 'TECHNICAL_SUPPORT',
  ads: 'ADS',
  other: 'OTHER',
};

export const INDUSTRY: Record<string, Industry> = {
  finance: 'FINANCE',
  healthcare: 'HEALTHCARE',
  ecommerce_and_retail: 'ECOMMERCE_AND_RETAIL',
  education: 'EDUCATION',
  logistics: 'LOGISTICS',
  real_estate: 'REAL_ESTATE',
  legal: 'LEGAL',
  hospitality_and_tourism: 'HOSPITALITY_AND_TOURISM',
  telecommunications: 'TELECOMMUNICATIONS',
  gastronomy: 'GASTRONOMY',
  automotive: 'AUTOMOTIVE',
  agriculture: 'AGRICULTURE',
  professional_services: 'PROFESSIONAL_SERVICES',
  media_and_entertainment: 'MEDIA_AND_ENTERTAINMENT',
  non_profit: 'NON_PROFIT',
  technology: 'TECHNOLOGY',
  energy: 'ENERGY',
  construction: 'CONSTRUCTION',
  art_and_design: 'ART_AND_DESIGN',
};

export const AWARENESS_CHANNEL: Record<string, AwarenessChannel> = {
  internet_search: 'INTERNET_SEARCH',
  networking: 'NETWORKING',
  family_friend: 'FAMILY_FRIEND',
  social_networks_ads: 'SOCIAL_NETWORK_ADS',
  webinars_talks: 'WEBINARS_TALKS',
  fair: 'FAIR',
  linkedin: 'LINKEDIN',
  podcasts: 'PODCASTS',
  other: 'OTHER',
};

export const SEASONALITY: Record<string, Seasonality> = {
  constant: 'CONSTANT',
  seasonal: 'SEASONAL',
  undefined: 'UNDEFINED',
};

export const INTEGRATION_LEVEL: Record<string, IntegrationLevel> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

export const URGENCY: Record<string, Urgency> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

export function mapEnum<T>(map: Record<string, T>, value: string, field: string): T {
  const mapped = map[value];
  if (!mapped) {
    throw new Error(
      `Invalid "${value}" for "${field}". Valid: ${Object.keys(map).join(', ')}`
    );
  }
  return mapped;
}
