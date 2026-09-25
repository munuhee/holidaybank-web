'use client';

import { useEffect, useState } from 'react';
import { adminApi } from './adminApi';
import type { Category, CountryInfo, Destination } from '@/types';

/**
 * The lookup lists the package and destination forms need: the category tree,
 * the countries, and every destination (drafts included).
 */
export function useCatalogOptions() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    let live = true;
    Promise.all([
      adminApi.get<Category[]>('/api/categories').catch(() => []),
      adminApi.get<CountryInfo[]>('/api/countries').catch(() => []),
      adminApi
        .list<Destination>('/api/admin/destinations?limit=100')
        .then(({ items }) => items)
        .catch(() => []),
    ]).then(([c, k, d]) => {
      if (!live) return;
      setCategories(c);
      setCountries(k);
      setDestinations(d);
    });
    return () => {
      live = false;
    };
  }, []);

  return { categories, countries, destinations };
}
