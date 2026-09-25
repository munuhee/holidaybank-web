import type { NextConfig } from 'next';

/**
 * Admin-uploaded media is served by the Django API from /uploads, so the API's
 * hostname has to be allowed here or <Image> refuses to render it.
 *
 * Derived from NEXT_PUBLIC_API_URL and API_INTERNAL_URL rather than hardcoded, because the
 * API lives in its own service and moves to a real hostname in production. The localhost
 * entries stay for development.
 */
function uploadPatterns(): NonNullable<NextConfig['images']>['remotePatterns'] {
  const patterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
    { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/uploads/**' },
    { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/uploads/**' },
  ];

  for (const apiUrl of [process.env.NEXT_PUBLIC_API_URL, process.env.API_INTERNAL_URL]) {
    if (!apiUrl) continue;
    try {
      const { protocol, hostname, port } = new URL(apiUrl);
      const scheme = protocol.replace(':', '');
      if (scheme !== 'http' && scheme !== 'https') continue;

      const already = patterns.some((p) => p.hostname === hostname && (p.port ?? '') === port);
      if (!already) {
        patterns.push({ protocol: scheme, hostname, port, pathname: '/uploads/**' });
      }
    } catch {
      // A malformed API URL should not break the build; the fetch layer
      // surfaces that problem far more clearly than a config crash would.
    }
  }

  return patterns;
}

/**
 * /backend/* is proxied to the API (API_INTERNAL_URL). Pointing
 * NEXT_PUBLIC_API_URL at https://<site>/backend makes the browser talk to the
 * API on the site's own origin, so the admin cookie belongs to the site and the
 * middleware can see it. Needed when the site and API share no parent domain
 * (e.g. *.netlify.app and *.up.railway.app).
 */
async function rewrites() {
  const target = process.env.API_INTERNAL_URL?.replace(/\/+$/, '');
  return target ? [{ source: '/backend/:path*', destination: `${target}/:path*` }] : [];
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: uploadPatterns(),
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  rewrites,
};

export default nextConfig;
