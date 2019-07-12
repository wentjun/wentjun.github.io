import React from 'react';
import spotlightStyles from './spotlight.module.css';

export default () => (
  <section className={spotlightStyles.spotlight__cover}>
    <div
      className={`${spotlightStyles.spotlight__content} ${spotlightStyles.spotlight__content_right}`}
    >
      <header>
        <h2>Hi, I am Wen Tjun.</h2>
        <p className={spotlightStyles.spotlight__contentHighlight}>
          I'm a software engineer. I love JavaScript/TypeScript, design, and a
          good cup of coffee.
        </p>
      </header>
      <p>
        I strongly believe in making use of technology to create value and
        improve the lives of people. I currently work at{' '}
        <a href="https://www.mafint.com/" target="_blank">
          MAF Intelligence
        </a>{' '}
        as a Front End Developer, and my previous experiences include working as
        a full stack web developer in{' '}
        <a href="https://worldsmarathons.com/" target="_blank">
          World's Marathons
        </a>
        , Product in{' '}
        <a href="http://keepinview.totemapp.com/company" target="_blank">
          KIV
        </a>
        , as well as Co-founder of Brackets for Change. I{' '}
        <a href="https://medium.com/@wentjun" target="_blank">
          write
        </a>{' '}
        to consolidate my learning experiences as a software engineer (coming
        soon! November 2018).
      </p>{' '}
      <p>
        I graduated from the National University of Singapore (NUS) in May 2018.
      </p>
    </div>
  </section>
);
