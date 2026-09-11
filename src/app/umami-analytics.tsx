import Script from 'next/script';

export default function UmamiAnalytics() {
  if (
    process.env.UMAMI_ENABLED !== 'true' ||
    process.env.CONTEXT !== 'production'
  ) {
    return null;
  }

  const websiteId = process.env.UMAMI_WEBSITE_ID?.trim();
  const scriptUrl = process.env.UMAMI_SCRIPT_URL?.trim();
  if (!websiteId || !scriptUrl) return null;

  return (
    <Script
      id="umami-analytics"
      src={scriptUrl}
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-domains="wentjun.com"
      data-exclude-search="true"
      data-exclude-hash="true"
      data-do-not-track="true"
    />
  );
}
