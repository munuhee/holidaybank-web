import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/ui/PageBanner';
import { PackageCard } from '@/components/tours/PackageCard';
import { TourFilters } from '@/components/tours/TourFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { apiListSafe } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import { flattenCategories, getCategories, getCountries } from '@/lib/catalog';
import { TAGS } from '@/lib/tags';
import type { Tour } from '@/types';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (sp: Record<string, string | string[] | undefined>, key: string) =>
  (Array.isArray(sp[key]) ? sp[key][0] : sp[key]) as string | undefined;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const slug = one(await searchParams, 'category');
  const category = slug ? flattenCategories(await getCategories()).find((c) => c.slug === slug) : undefined;
  return {
    title: category ? category.name : 'Packages & Safaris',
    description:
      category?.description ||
      'Kenyan getaways, safari adventures across East Africa, and handpicked international escapes from Holidaybank Expeditions.',
  };
}

// Next 15: searchParams is a Promise and must be awaited.
export default async function ToursPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(one(sp, 'page') ?? 1) || 1);
  const query = new URLSearchParams({ page: String(page), limit: '12' });
  for (const key of ['category', 'country', 'sort', 'q'] as const) {
    const value = one(sp, key);
    if (value) query.set(key, value);
  }

  const [{ items, meta }, settings, categories, countries] = await Promise.all([
    apiListSafe<Tour>(`/api/tours?${query.toString()}`, { tags: [TAGS.tours] }),
    getSettings(),
    getCategories(),
    getCountries(),
  ]);

  // A filtered view takes its banner from the category itself.
  const category = flattenCategories(categories).find((c) => c.slug === one(sp, 'category'));
  const banner = settings.pages.tours;

  return (
    <>
      <PageBanner
        eyebrow={category?.eyebrow}
        title={category ? category.name : banner.title}
        subtitle={category?.description || banner.subtitle}
        image={category?.heroImage ?? banner.image}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/tours', label: 'Packages' },
          ...(category ? [{ href: `/tours?category=${category.slug}`, label: category.name }] : []),
        ]}
      />

      <section className="bg-cream-100 py-14 md:py-20">
        <div className="container-page">
          <TourFilters total={meta?.total ?? items.length} categories={categories} countries={countries} />

          {items.length === 0 ? (
            <EmptyState
              title="No packages match those filters"
              message="Try widening your search, or tell us your dates and budget and we will put a trip together."
              action={<ButtonLink href="/contact">Plan a custom trip</ButtonLink>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((tour, i) => (
                  <PackageCard key={tour._id} tour={tour} priority={i < 4} />
                ))}
              </div>

              {meta && meta.totalPages > 1 ? (
                <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((n) => {
                    const next = new URLSearchParams(query);
                    next.set('page', String(n));
                    next.delete('limit');
                    return (
                      <Link
                        key={n}
                        href={`/tours?${next.toString()}`}
                        aria-current={n === meta.page ? 'page' : undefined}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                          n === meta.page
                            ? 'bg-charcoal-900 text-cream-50'
                            : 'border border-cream-300 text-charcoal-900 hover:border-charcoal-900'
                        }`}
                      >
                        {n}
                      </Link>
                    );
                  })}
                </nav>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
