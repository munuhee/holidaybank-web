import type { Metadata } from 'next';
import { PageBanner } from '@/components/ui/PageBanner';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSettings } from '@/lib/settings';
import { apiGetSafe } from '@/lib/api';
import { telHref, whatsappHref, secondaryNumber } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Tell us where, when and who is travelling, and Holidaybank Expeditions will come back with options.',
};

const DEFAULT_INTERESTS = ['Kenyan Packages', 'Kenyan Safaris', 'East Africa Safaris', 'International Holidays', 'Tailor-made Trip'];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [settings, options, sp] = await Promise.all([
    getSettings(),
    apiGetSafe<{ interests: string[] }>('/api/enquiries/options', { interests: DEFAULT_INTERESTS }),
    searchParams,
  ]);
  const { contact } = settings;
  const banner = settings.pages.contact;
  const secondNumber = secondaryNumber(contact.phone, contact.whatsapp);
  const interest = typeof sp.interest === 'string' && options.interests.includes(sp.interest) ? sp.interest : undefined;
  const address = [contact.addressLine, contact.poBox, contact.city].filter(Boolean);

  return (
    <>
      <PageBanner
        title={banner.title}
        subtitle={banner.subtitle}
        image={banner.image}
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/contact', label: 'Contact' },
        ]}
      />

      <section className="bg-cream-100 py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_360px]">
          <ContactForm interests={options.interests} defaultInterest={interest} />

          <aside className="space-y-5">
            <div className="rounded-[3px] bg-charcoal-900 p-7 text-cream-100">
              <h2 className="mb-1 text-xl text-white">Get in touch</h2>
              <p className="mb-6 text-sm text-[#a9a394]">{contact.supportHours}.</p>

              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="mb-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold-400">Phone</dt>
                  <dd className="space-y-1">
                    <a href={`tel:${telHref(contact.phone)}`} className="block text-white transition-colors hover:text-gold-400">
                      {contact.phone}
                    </a>
                    {secondNumber ? (
                      <a href={`tel:${telHref(secondNumber)}`} className="block text-white transition-colors hover:text-gold-400">
                        {secondNumber}
                      </a>
                    ) : null}
                  </dd>
                </div>

                <div>
                  <dt className="mb-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold-400">Email</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`} className="break-all text-white transition-colors hover:text-gold-400">
                      {contact.email}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="mb-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold-400">Office</dt>
                  <dd>
                    <address className="not-italic text-cream-200">
                      {address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </dd>
                </div>
              </dl>

              {contact.whatsapp ? (
                <a
                  href={whatsappHref(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 flex h-11 w-full items-center justify-center rounded-[3px] bg-[#25D366] text-sm font-medium text-white transition-colors hover:bg-[#1ebe5a]"
                >
                  Message us on WhatsApp
                </a>
              ) : null}
            </div>

            {contact.addressLine ? (
              <div className="rounded-[3px] border border-cream-300 bg-white p-7">
                <h2 className="mb-3 text-xl">Visit us</h2>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.join(', '))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-leaf-700 transition-colors hover:text-gold-600"
                >
                  Open in Google Maps <span aria-hidden>→</span>
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
