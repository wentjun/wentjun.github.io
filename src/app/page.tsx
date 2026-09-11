import type { Metadata, Viewport } from 'next';
import LayerHome from '../components/layers/layer-home';

export const dynamic = 'force-static';

const description =
  'Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.';
const canonicalUrl = 'https://wentjun.com/';
const socialImage = {
  url: 'https://wentjun.com/social-preview.png',
  width: 1200,
  height: 630,
  alt: 'Wen Tjun — full-stack builder portfolio',
};

export const metadata: Metadata = {
  title: 'Wen Tjun: Full-stack builder',
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Wen Tjun: Full-stack builder',
    description,
    url: canonicalUrl,
    siteName: 'Wen Tjun',
    type: 'website',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wen Tjun: Full-stack builder',
    description,
    images: [socialImage],
  },
};

export const viewport: Viewport = { themeColor: '#e5eae9' };

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@id': 'https://wentjun.com/#person',
      '@type': 'Person',
      name: 'Wen Tjun',
      givenName: 'Wen Tjun',
      familyName: 'Chan',
      url: canonicalUrl,
      description,
      sameAs: [
        'https://www.freecodecamp.org/news/author/wentjun/',
        'https://github.com/wentjun',
        'https://gitnation.com/person/chan_wen_tjun',
        'https://stackoverflow.com/users/10959940/wentjun',
        'https://www.linkedin.com/in/wentjun/',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script text; replacing < prevents tag injection.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <LayerHome />
    </>
  );
}
