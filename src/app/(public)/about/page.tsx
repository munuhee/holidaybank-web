import type { Metadata } from 'next';
import Image from 'next/image';
import { PageBanner } from '@/components/ui/PageBanner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { getSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Holidaybank Expeditions plans Kenyan getaways, East African safaris, and international travel for people who want it done properly.',
};

/**
 * Everything on this page comes from Site settings (About section and
 * values), which restate what the company's own website says. No founding
 * dates, team sizes or accreditations are claimed: none have been supplied.
 */
export default async function AboutPage() {
  const settings = await getSettings();
  const { about, values, contact } = settings;
  const banner = settings.pages.about;

  return (
    <>
      <PageBanner
        title={banner.title}
        subtitle={banner.subtitle}
        image={banner.image}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/about', label: 'About Us' },
        ]}
      />

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[0.85rem] font-medium text-gold-600">{about.intro}</p>
            <h2 className="mb-6 text-3xl leading-tight md:text-4xl">{about.heading}</h2>
            <div className="space-y-5 text-base leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/tours" variant="secondary">
                Browse packages
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Talk to us →
              </ButtonLink>
            </div>
          </div>

          {about.images.length ? (
            <div className="grid grid-cols-2 gap-4">
              {about.images.slice(0, 2).map((image, i) => (
                <div key={image.url} className={`relative aspect-[3/4] overflow-hidden rounded-[2px] ${i === 1 ? 'mt-10' : ''}`}>
                  <Image src={image.url} alt={image.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {about.pillars.length ? (
        <section className="bg-charcoal-900 py-16 md:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="What we plan" title="Three ways to travel with us" tone="light" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {about.pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 90}>
                  <article className="flex h-full flex-col rounded-[2px] border border-[#3a3c42] bg-charcoal-800 p-7">
                    <p className="mb-2 text-[0.72rem] uppercase tracking-[0.08em] text-gold-400">{pillar.eyebrow}</p>
                    <h3 className="mb-3 text-xl text-white">{pillar.title}</h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-[#a9a394]">{pillar.body}</p>
                    <ButtonLink href={pillar.href} variant="outline-gold" size="sm" className="self-start">
                      See {pillar.title.toLowerCase()} →
                    </ButtonLink>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {values?.length ? (
        <section className="bg-white py-16 md:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="How we work" title="What you can expect" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <Reveal key={value.title} delay={i * 80}>
                  <article className="h-full rounded-[2px] border border-cream-300 bg-cream-50 p-7">
                    <span aria-hidden className="mb-4 block font-display text-3xl text-gold-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mb-3 text-lg">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{value.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-charcoal-950 py-16 md:py-20">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-2xl text-3xl text-white">Based in {contact.city}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#b8b2a0]">{contact.supportHours}.</p>
          <div className="mt-8">
            <ButtonLink href="/contact" size="lg">
              Plan your trip
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
