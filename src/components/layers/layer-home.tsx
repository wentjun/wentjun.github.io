import LayerExplorer from './layer-explorer';
import styles from './layers.module.css';

export default function LayerHome() {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <a className={styles.brand} href="https://github.com/wentjun">
          Wen Tjun<span aria-hidden="true">.</span>
        </a>
        <p className={styles.place}>Based in Singapore.</p>
        <a className={styles.hello} href="mailto:wentjun289@hotmail.com">
          Say hello <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main id="main" tabIndex={-1}>
        <LayerExplorer
          introduction={
            <div className={styles.introduction}>
              <h1 id="title">Full-stack builder.</h1>
              <p>
                I bring models into products people can use, including the
                engineering needed to run them reliably.
              </p>
            </div>
          }
        />
      </main>
      <footer className={styles.footer}>
        <p>Elsewhere</p>
        <nav aria-label="Elsewhere">
          <a href="https://www.freecodecamp.org/news/author/wentjun/">
            Writing <span aria-hidden="true">↗</span>
          </a>
          <a href="https://github.com/wentjun">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href="https://www.linkedin.com/in/wentjun/">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}
