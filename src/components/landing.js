import React from 'react';
import landingStyles from './landing.module.css';

export default () => (
  <section className={landingStyles.landing__cover}>
    <div className={landingStyles.landing__content}>
      <header>
        <h2>Hello World</h2>
        <p>Welcome Home</p>
      </header>
    </div>
    <a href="#spotlight-one" className="downArrow" aria-label="down arrow">
      <i></i>
    </a>
  </section>
);
