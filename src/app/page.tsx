import type { Metadata, Viewport } from 'next';
import LayerHome from '../components/layers/layer-home';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Wen Tjun — Full-stack builder',
  description:
    'Wen Tjun, a full-stack builder based in Singapore. Bringing models into products people can use, including the engineering needed to run them reliably.',
};

export const viewport: Viewport = { themeColor: '#e5eae9' };

export default function Home() {
  return <LayerHome />;
}
