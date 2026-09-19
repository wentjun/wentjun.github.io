import type { Metadata } from 'next';
import Whereabouts from '../../components/whereabouts/whereabouts';
import { getCountryHighlights } from './country-highlights';

export const dynamic = 'force-static';

const title = 'Whereabouts - Wen Tjun';
const description =
  'Where I am now and a growing record of the places I’ve been.';
const url = 'https://wentjun.com/whereabouts';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: 'Wen Tjun', type: 'website' },
  twitter: { card: 'summary', title, description },
};

export default function WhereaboutsPage() {
  return (
    <Whereabouts
      initialMonth={new Date().toISOString().slice(0, 7)}
      countryPaths={getCountryHighlights()}
    />
  );
}
