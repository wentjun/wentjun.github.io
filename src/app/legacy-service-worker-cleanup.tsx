'use client';

import { useEffect } from 'react';

const GATSBY_CACHE_PREFIXES = ['gatsby-plugin-offline', 'workbox-precache'];

export default function LegacyServiceWorkerCleanup() {
  useEffect(() => {
    async function cleanup() {
      if ('serviceWorker' in navigator) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          await Promise.allSettled(
            registrations.map((registration) => registration.unregister())
          );
        } catch {
          // Restricted browsing modes may deny storage access. Migration is best effort.
        }
      }
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.allSettled(
            cacheNames
              .filter((cacheName) =>
                GATSBY_CACHE_PREFIXES.some((prefix) =>
                  cacheName.includes(prefix)
                )
              )
              .map((cacheName) => caches.delete(cacheName))
          );
        } catch {
          // Cache permissions must not prevent the current page from working.
        }
      }
    }
    void cleanup();
  }, []);

  return null;
}
