import React from 'react';
import contactStyles from './contact.module.css';

export default () => (
  <section className={contactStyles.contact__cover}>
    <div className={contactStyles.contact__contentQuote}>
      <header>
        <span>Your greatest dreams are all on the other side of </span>
        <span>the wall of fear and caution</span>
      </header>
    </div>
    <a href="#contact" className="downArrow"></a>
  </section>
);
