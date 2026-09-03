import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wen Tjun',
    short_name: 'Wen Tjun',
    start_url: '/',
    background_color: '#1c1d26',
    theme_color: '#1c1d26',
    display: 'standalone',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
