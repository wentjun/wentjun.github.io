import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wen Tjun',
    short_name: 'Wen Tjun',
    start_url: '/',
    background_color: '#e5eae9',
    theme_color: '#e5eae9',
    display: 'standalone',
    icons: [
      {
        src: '/icon.png?v=mineral',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
