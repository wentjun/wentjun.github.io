import Link from 'next/link';
import LayerExplorer from './layer-explorer';
import styles from './layers.module.css';

function DestinationIcon({
  kind,
}: {
  kind: 'internal' | 'external' | 'email';
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-destination-icon={kind}
    >
      {kind === 'email' ? (
        <>
          <rect x="2" y="3.5" width="12" height="9" rx="1" />
          <path d="m2.5 4.5 5.5 4 5.5-4" />
        </>
      ) : (
        <path
          d={kind === 'internal' ? 'M3 8h10M9 4l4 4-4 4' : 'm4 12 8-8M4 4h8v8'}
        />
      )}
    </svg>
  );
}

export default function LayerHome() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <p className={styles.brand}>
          Wen Tjun<span aria-hidden="true">.</span>
        </p>
        <p className={styles.place}>Based in Singapore.</p>
        <a
          className={styles.hello}
          href="mailto:wentjun289@hotmail.com"
          data-umami-event="contact_click"
          data-umami-event-destination="email"
        >
          Say hello <DestinationIcon kind="email" />
        </a>
      </header>
      <main id="main" tabIndex={-1}>
        <LayerExplorer
          introduction={
            <div className={styles.introduction}>
              <h1 id="title">
                Full-stack <span>builder.</span>
              </h1>
              <p>
                I build real products with models, backed by the engineering to
                run them reliably.
              </p>
            </div>
          }
        />
      </main>
      <footer className={styles.footer}>
        <Link
          className={styles.whereabouts}
          href="/whereabouts"
          prefetch={false}
        >
          Whereabouts <DestinationIcon kind="internal" />
        </Link>
        <nav aria-label="Profile links">
          <a
            href="https://www.freecodecamp.org/news/author/wentjun/"
            data-umami-event="profile_click"
            data-umami-event-destination="writing"
          >
            Writing <DestinationIcon kind="external" />
          </a>
          <a
            href="https://github.com/wentjun"
            data-umami-event="profile_click"
            data-umami-event-destination="github"
          >
            GitHub <DestinationIcon kind="external" />
          </a>
          <a
            href="https://www.linkedin.com/in/wentjun/"
            data-umami-event="profile_click"
            data-umami-event-destination="linkedin"
          >
            LinkedIn <DestinationIcon kind="external" />
          </a>
        </nav>
      </footer>
    </div>
  );
}
