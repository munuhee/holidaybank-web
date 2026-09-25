import { apiGetSafe } from './api';
import { TAGS } from './tags';
import type { Category, CountryInfo } from '@/types';

/**
 * The product lines (Kenyan Packages, International, Safaris) as a tree.
 * The header menu, footer links and tour filters are built from this, so a
 * category added in the dashboard appears everywhere without a deploy.
 */
export function getCategories(): Promise<Category[]> {
  return apiGetSafe<Category[]>('/api/categories', [], { tags: [TAGS.categories, TAGS.tours] });
}

export function getCountries(): Promise<CountryInfo[]> {
  return apiGetSafe<CountryInfo[]>('/api/countries', [], { tags: [TAGS.destinations, TAGS.tours] });
}

/** Flattens the tree to every category, groups first then their children. */
export function flattenCategories(tree: Category[]): Category[] {
  return tree.flatMap((group) => [group, ...(group.children ?? [])]);
}
