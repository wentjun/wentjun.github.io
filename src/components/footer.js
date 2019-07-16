import React from 'react';
import footerStyles from './footer.module.css';

import {
  faTwitter,
  faLinkedinIn,
  faFreeCodeCamp,
  faGithub,
  faMediumM,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default () => (
  <footer>
    <div className="row">
      <a
        className={footerStyles.footer__iconContainer}
        href="https://twitter.com/wentjun"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faTwitter}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        className={footerStyles.footer__iconContainer}
        href="https://www.linkedin.com/in/wentjun/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faLinkedinIn}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        className={footerStyles.footer__iconContainer}
        href="https://github.com/wentjun"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faGithub}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        className={footerStyles.footer__iconContainer}
        href="https://medium.com/@wentjun"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faMediumM}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        className={footerStyles.footer__iconContainer}
        href="https://www.freecodecamp.org/news/author/wentjun/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faFreeCodeCamp}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        className={footerStyles.footer__iconContainer}
        href="mailto: wentjun@u.nus.edu"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          className={footerStyles.footer__icon}
        />
      </a>
    </div>
  </footer>
);
