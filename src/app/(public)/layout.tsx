import { Header, type NavItem } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactLauncher } from '@/components/layout/ContactLauncher';
import { getSettings } from '@/lib/settings';
import { getCategories } from '@/lib/catalog';
import type { Category } from '@/types';

/**
 * The menu follows the original site: Home, one dropdown per product line
 * (Kenyan Packages > Locals, International > Europe, Safaris > Kenyan Safaris /
 * Kenya · Tanzania · Uganda · Rwanda), then the supporting pages. The product
 * dropdowns come from the category tree, so they track the dashboard.
 */
function buildNav(categories: Category[]): NavItem[] {
  const products: NavItem[] = categories.map((group) => ({
    href: `/tours?category=${group.slug}`,
    match: `category=${group.slug}`,
    label: group.navLabel || group.name,
    items: [
      { href: `/tours?category=${group.slug}`, label: `All ${group.name}` },
      ...(group.children ?? []).map((child) => ({
        href: `/tours?category=${child.slug}`,
        label: child.navLabel || child.name,
      })),
    ],
  }));

  return [
    { href: '/', label: 'Home' },
    ...products,
    { href: '/destinations', label: 'Destinations' },
    {
      href: '/about',
      label: 'More',
      items: [
        { href: '/about', label: 'About us' },
        { href: '/services', label: 'What we do' },
        { href: '/blog', label: 'Travel journal' },
        { href: '/tours', label: 'All packages' },
      ],
    },
    { href: '/contact', label: 'Contact Us' },
  ];
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        nav={buildNav(categories)}
        phone={settings.contact.phone}
        whatsapp={settings.contact.whatsapp}
        logo={settings.brand.logoCompact}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
      <ContactLauncher
        phone={settings.contact.phone}
        whatsapp={settings.contact.whatsapp}
        email={settings.contact.email}
      />
    </div>
  );
}
