import LayerExplorer from './layer-explorer';
import styles from './layers.module.css';

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
                I build real products with models, backed by the engineering to
                run them reliably.
              </p>
            </div>
          }
        />
      </main>
      <footer className={styles.footer}>
        <nav aria-label="Profile links">
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
