import Link from 'next/link';
import type { Category, SiteSettings } from '@/types';
import { telHref, whatsappHref, secondaryNumber } from '@/lib/format';
import { NewsletterForm } from './NewsletterForm';
import { SOCIAL_LABELS, type SocialKey } from '@/components/ui/SocialIcon';

const COMPANY = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'What We Do' },
  { href: '/blog', label: 'Travel Journal' },
  { href: '/contact', label: 'Contact' },
  { href: '/credits', label: 'Photo credits' },
];

/** The original site's footer: brand and blurb, Explore, Company, Get in touch. */
export function Footer({ settings, categories }: { settings: SiteSettings; categories: Category[] }) {
  const { contact, socials, newsletter, footerBlurb, notice, brand } = settings;
  const secondNumber = secondaryNumber(contact.phone, contact.whatsapp);
  const year = new Date().getFullYear();
  const activeSocials = Object.entries(socials ?? {}).filter(([, url]) => Boolean(url));

  // Destinations belongs with the product lines, not under Company.
  const explore = [
    ...categories.flatMap((group) => [
      { href: `/tours?category=${group.slug}`, label: group.navLabel || group.name },
      ...(group.children ?? [])
        .filter((child) => (child.navLabel || child.name) !== (group.navLabel || group.name))
        .map((child) => ({ href: `/tours?category=${child.slug}`, label: child.navLabel || child.name, nested: true })),
    ]),
    { href: '/destinations', label: 'Destinations' },
  ];

  return (
    <footer className="bg-charcoal-950 text-[#a9a394]">
      <div className="container-page grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
          <img src={brand.logo.url} alt={brand.logo.alt} width={220} height={100} className="mb-5 h-28 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed">{footerBlurb}</p>

          {activeSocials.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {activeSocials.map(([key, url]) => (
                <a
                  key={key}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs transition-colors hover:border-gold-500 hover:text-gold-400"
                >
                  {SOCIAL_LABELS[key as SocialKey] ?? key}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="mb-4 font-sans text-[0.95rem] font-medium text-white">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {explore.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors hover:text-gold-400 ${'nested' in item ? 'pl-3 text-[0.86rem] text-[#b8b2a0]' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-[0.95rem] font-medium text-white">Company</h3>
          <ul className="space-y-2.5 text-sm">
            {COMPANY.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-[0.95rem] font-medium text-white">Get in touch</h3>
          <address className="space-y-2.5 text-sm not-italic">
            <p>{[contact.addressLine, contact.city].filter(Boolean).join(', ')}</p>
            <p>
              <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-gold-400">
                {contact.email}
              </a>
            </p>
            <p className="space-y-1">
              <a href={`tel:${telHref(contact.phone)}`} className="block transition-colors hover:text-gold-400">
                {contact.phone}
              </a>
              {secondNumber ? (
                <a href={`tel:${telHref(secondNumber)}`} className="block transition-colors hover:text-gold-400">
                  {secondNumber}
                </a>
              ) : null}
            </p>
            {contact.whatsapp ? (
              <p>
                <a
                  href={whatsappHref(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-400"
                >
                  Message us on WhatsApp
                </a>
              </p>
            ) : null}
          </address>

          <h3 className="mb-2 mt-8 font-sans text-[0.95rem] font-medium text-white">{newsletter.heading}</h3>
          <p className="mb-3 text-sm leading-relaxed">{newsletter.blurb}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-[#34363b]">
        <div className="container-page flex flex-col justify-between gap-2.5 py-6 text-[0.82rem] sm:flex-row">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          {notice?.enabled && notice.text ? <p className="text-gold-400/80">{notice.text}</p> : <p>{brand.tagline}</p>}
        </div>
      </div>
    </footer>
  );
}
