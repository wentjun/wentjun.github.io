import React from 'react';
import spotlightStyles from './spotlight.module.css';

export default () => (
  <div>
    <section id="spotlight-one" className={spotlightStyles.spotlight__cover}>
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
          <a
            href="https://www.mafint.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            MAF Intelligence
          </a>{' '}
          as a Front End Developer, and my previous experiences include working
          as a full stack web developer in{' '}
          <a
            href="https://worldsmarathons.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            World's Marathons
          </a>
          , Product in{' '}
          <a
            href="http://keepinview.totemapp.com/company"
            rel="noopener noreferrer"
            target="_blank"
          >
            KIV
          </a>
          , as well as Co-founder of Brackets for Change. I{' '}
          <a
            href="https://medium.com/@wentjun"
            rel="noopener noreferrer"
            target="_blank"
          >
            write
          </a>{' '}
          to consolidate my learning experiences as a software engineer (coming
          soon! November 2018).
        </p>{' '}
        <p>
          I graduated from the National University of Singapore (NUS) in May
          2018.
        </p>
      </div>
      <a href="#spotlight-two" className="downArrow"></a>
    </section>
    <section id="spotlight-two" className={spotlightStyles.spotlight__cover}>
      <div
        className={`${spotlightStyles.spotlight__content} ${spotlightStyles.spotlight__content_left}`}
      >
        <header>
          <h2></h2>
          <p>Dreamer. Believer. Achiever.</p>
        </header>
        <p>Outside of my professional life, I have the following pursuits:</p>
        <ul>
          <li>Reading and writing.</li>
          <li>
            Casual Photography. I work with my iPhone 7 Plus and Sony camera.
          </li>
          <li>
            Martial arts. I have been trained in various martial arts including
            Taekwondo, Muay Thai, and Boxing. I am currently hooked on Brazilian
            Jiu-jitsu.
          </li>
          <li>
            House music. My favourite DJs include the Swedish House Mafia,
            Alesso, and Martin Garrix{' '}
          </li>
        </ul>
      </div>
      <a href="#four" className="downArrow"></a>
    </section>
  </div>
);
