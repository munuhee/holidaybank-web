import type { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { BlogCard } from '@/components/blog/BlogCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { apiListSafe } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import { TAGS } from '@/lib/tags';
import type { BlogPost } from '@/types';

export const metadata: Metadata = {
  title: 'Travel Journal',
  description: 'Planning guides for Kenya, East African safaris and European holidays from Holidaybank Expeditions.',
};

export default async function BlogPage() {
  const [{ items }, settings] = await Promise.all([
    apiListSafe<BlogPost>('/api/blog?limit=24', { tags: [TAGS.blog] }),
    getSettings(),
  ]);
  const banner = settings.pages.blog;

  return (
    <>
      <PageBanner
        title={banner.title}
        subtitle={banner.subtitle}
        image={banner.image}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/blog', label: 'Travel Journal' },
        ]}
      />

      <section className="bg-cream-50 py-16 md:py-24">
        <div className="container-page">
          {items.length === 0 ? (
            <EmptyState
              title="No articles yet"
              message="New planning guides are on the way. In the meantime, ask us anything directly."
              action={<ButtonLink href="/contact">Ask a question</ButtonLink>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((post, i) => (
                <Reveal key={post._id} delay={i * 80}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
