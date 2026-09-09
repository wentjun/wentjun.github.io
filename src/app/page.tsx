import type { Metadata, Viewport } from 'next';
import LayerHome from '../components/layers/layer-home';

export const dynamic = 'force-static';

const description =
  'Wen Tjun, a full-stack builder based in Singapore. I build real products with models, backed by the engineering to run them reliably.';

export const metadata: Metadata = {
  title: 'Wen Tjun: Full-stack builder',
  description,
  alternates: { canonical: 'https://wentjun.com/' },
  openGraph: {
    title: 'Wen Tjun: Full-stack builder',
    description,
    url: 'https://wentjun.com/',
    siteName: 'Wen Tjun',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#e5eae9' };

export default function Home() {
  return <LayerHome />;
}
