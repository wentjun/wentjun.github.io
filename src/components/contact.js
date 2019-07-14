import React from 'react';
import contactStyles from './contact.module.css';

export default () => (
  <div>
    <section className={contactStyles.contact__cover}>
      <div className={contactStyles.contact__contentQuote}>
        <header>
          <span>Your greatest dreams are all on the other side of </span>
          <span>the wall of fear and caution</span>
        </header>
      </div>
      <a href="#contact" className="downArrow"></a>
    </section>
    <section
      id="contact"
      className={`wrapper ${contactStyles.contact__formWrapper}`}
    >
      <div className="container">
        <header className="text-center">
          <h2>Say Hello</h2>
          <p>I'd love to hear from you</p>
        </header>
        <form action="https://formspree.io/wentjun@u.nus.edu" method="post">
          <div className={contactStyles.contact__formElement}>
            <div className={contactStyles.contact__formGroup}>
              <input type="text" placeholder="Your name"></input>
            </div>
          </div>
          <div className={contactStyles.contact__formElement}>
            <div className={contactStyles.contact__formGroup}>
              <input
                type="email"
                placeholder="Your email"
                name="_replyto"
              ></input>
            </div>
          </div>
          <div className={contactStyles.contact__formElement}>
            <div className={contactStyles.contact__formGroup}>
              <input type="text" placeholder="Subject"></input>
            </div>
          </div>
          <div className={contactStyles.contact__formElement}>
            <div className={contactStyles.contact__formGroup}>
              <textarea
                name="message"
                rows="3"
                placeholder="Your message"
              ></textarea>
            </div>
          </div>
          <div className={contactStyles.contact__formElement}>
            <div className={contactStyles.contact__formGroup}>
              <button type="submit" value="Send">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
);
