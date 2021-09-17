import React from 'react';
import AnchorLink from '../utilities/anchor-link.js';
import * as spotlightStyles from './spotlight.module.css';

const Spotlight = () => (
  <div>
    <section id="spotlight-one" className={spotlightStyles.spotlight__cover}>
      <div
        className={`${spotlightStyles.spotlight__content} ${spotlightStyles.spotlight__content_right}`}
      >
        <header>
          <h2>Hi, I am Wen Tjun.</h2>
          <p>
            I'm a software engineer. I love JavaScript/TypeScript, design, and a
            good cup of coffee.
          </p>
        </header>
        <p>
          I strongly believe in making use of technology to create value and
          improve the lives of people. I am currently a Full Stack Developer at{' '}
          <a
            href="https://splyt.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Splyt
          </a>
          , working on improving mobility solutions.
          My previous experiences include working as a Frontend developer at {' '}
          <a
            href="https://www.mafint.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            MAF Intelligence
          </a>
          , as well as Full Stack Web Developer in{' '}
          <a
            href="https://worldsmarathons.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            World's Marathons
          </a>
          . I{' '}
          <a
            href="https://medium.com/@wentjun"
            rel="noopener noreferrer"
            target="_blank"
          >
            write
          </a>{' '}
          to consolidate my learning experiences as a software engineer.
        </p>{' '}
        <p>
          I graduated from the National University of Singapore (NUS) in May
          2018.
        </p>
      </div>
      <div className="mdHiddenDown">
        <AnchorLink location="spotlight-two" />
      </div>
    </section>
    <section id="spotlight-two" className={spotlightStyles.spotlight__cover}>
      <div
        className={`${spotlightStyles.spotlight__mobileCover} mdHiddenUp`}
      ></div>
      <div
        className={`${spotlightStyles.spotlight__content} ${spotlightStyles.spotlight__content_left}`}
      >
        <header>
          <p>Dreamer. Believer. Achiever.</p>
        </header>
        <p>Outside of my professional life, I have the following pursuits:</p>
        <ul>
          <li>
            Casual Photography. I work with my iPhone 7 Plus and Sony camera.
          </li>
          <li>
            More programming. I enjoy working on data visualisations, and my tools include{' '}
            <a
              href="https://wentjun.com/d3-historical-prices-data-joins/"
              rel="noopener noreferrer"
              target="_blank"
            >
              D3.js
            </a>
            {' '}and Mapbox. From time to time, I pop by{' '}
            <a
              href="https://stackoverflow.com/users/10959940/wentjun"
              rel="noopener noreferrer"
              target="_blank"
            >
              StackOverflow
            </a>
            {' '}and answer a few questions.
          </li>
          <li>
            Fitness and Martial arts. I have been trained in various martial arts including
            Muay Thai, Boxing, and Brazilian Jiu-jitsu. Talk to me about nutrition,
            strength programmes, and fitness in general!
          </li>
        </ul>
      </div>
      <div className="mdHiddenDown">
        <AnchorLink location="personal-projects" />
      </div>
    </section>
  </div>
);

export default Spotlight;