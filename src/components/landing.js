import React from 'react';
import AnchorLink from '../utilities/anchor-link.js';
import * as landingStyles from './landing.module.css';

const Landing = () => (
  <section className={landingStyles.landing__cover}>
    <div className={landingStyles.landing__content}>
      <header>
        <h2>Hello World</h2>
        <p>Welcome Home</p>
      </header>
    </div>
    <AnchorLink location="spotlight-one" />
  </section>
);

export default Landing;