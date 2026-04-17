import type {
  AwarenessChannel,
  Industry,
  IntegrationLevel,
  Seasonality,
  Urgency,
  UseCase,
  WeeklyVolume,
} from '@prisma/client';
import {
  AWARENESS_CHANNEL_LABELS,
  INDUSTRY_LABELS,
  INTEGRATION_LEVEL_LABELS,
  SEASONALITY_LABELS,
  URGENCY_LABELS,
  USE_CASE_LABELS,
  WEEKLY_VOLUME_LABELS,
} from '@/lib/enum-labels';

export interface FilterOption {
  value: string;
  label: string;
}

export interface CategoryFilters {
  weeklyVolume: WeeklyVolume[];
  useCase: UseCase[];
  industry: Industry[];
  awarenessChannel: AwarenessChannel[];
  seasonality: Seasonality[];
  integrationLevel: IntegrationLevel[];
  urgency: Urgency[];
}

interface CategoryFilterable {
  weeklyVolume: WeeklyVolume;
  useCase: UseCase;
  industry: Industry;
  awarenessChannel: AwarenessChannel;
  seasonality: Seasonality;
  integrationLevel: IntegrationLevel;
  urgency: Urgency;
}

export const EMPTY_CATEGORY_FILTERS: CategoryFilters = {
  weeklyVolume: [],
  useCase: [],
  industry: [],
  awarenessChannel: [],
  seasonality: [],
  integrationLevel: [],
  urgency: [],
};

const makeOptions = <T extends string>(labels: Record<T, string>): Array<{ value: T; label: string }> => {
  return Object.entries(labels).map(([value, label]) => ({
    value: value as T,
    label: String(label),
  }));
};

export const WEEKLY_VOLUME_FILTER_OPTIONS = makeOptions(WEEKLY_VOLUME_LABELS);
export const USE_CASE_FILTER_OPTIONS = makeOptions(USE_CASE_LABELS);
export const INDUSTRY_FILTER_OPTIONS = makeOptions(INDUSTRY_LABELS);
export const AWARENESS_CHANNEL_FILTER_OPTIONS = makeOptions(AWARENESS_CHANNEL_LABELS);
export const SEASONALITY_FILTER_OPTIONS = makeOptions(SEASONALITY_LABELS);
export const INTEGRATION_LEVEL_FILTER_OPTIONS = makeOptions(INTEGRATION_LEVEL_LABELS);
export const URGENCY_FILTER_OPTIONS = makeOptions(URGENCY_LABELS);

const matchesSelected = <T extends string>(selected: T[], value: T) => {
  if (selected.length === 0) return true;
  return selected.includes(value);
};

export function hasActiveCategoryFilters(filters: CategoryFilters) {
  return (
    filters.weeklyVolume.length > 0 ||
    filters.useCase.length > 0 ||
    filters.industry.length > 0 ||
    filters.awarenessChannel.length > 0 ||
    filters.seasonality.length > 0 ||
    filters.integrationLevel.length > 0 ||
    filters.urgency.length > 0
  );
}

export function matchesCategoryFilters(
  category: CategoryFilterable | null,
  filters: CategoryFilters
) {
  if (!hasActiveCategoryFilters(filters)) return true;
  if (!category) return false;

  return (
    matchesSelected(filters.weeklyVolume, category.weeklyVolume) &&
    matchesSelected(filters.useCase, category.useCase) &&
    matchesSelected(filters.industry, category.industry) &&
    matchesSelected(filters.awarenessChannel, category.awarenessChannel) &&
    matchesSelected(filters.seasonality, category.seasonality) &&
    matchesSelected(filters.integrationLevel, category.integrationLevel) &&
    matchesSelected(filters.urgency, category.urgency)
  );
}
