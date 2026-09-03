'use client';

import { useEffect } from 'react';

const GATSBY_CACHE_PREFIXES = ['gatsby-plugin-offline', 'workbox-precache'];

export default function LegacyServiceWorkerCleanup() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations.map((registration) => registration.unregister())
          )
        );
    }

    if ('caches' in window) {
      void caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter((cacheName) =>
                GATSBY_CACHE_PREFIXES.some((prefix) =>
                  cacheName.includes(prefix)
                )
              )
              .map((cacheName) => caches.delete(cacheName))
          )
        );
    }
  }, []);

  return null;
}
