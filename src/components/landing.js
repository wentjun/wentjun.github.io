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
    <a href="#two" className={landingStyles.landing__downArrow}></a>
  </section>
);
