import React from 'react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faLinkedinIn,
  faFreeCodeCamp,
  faGithub,
  faMediumM,
  faStackOverflow,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as footerStyles from './footer.module.css';

const Footer = () => (
  <footer>
    <div className="row">
      <a
        href="https://twitter.com/wentjun"
        target="_blank"
        rel="noopener noreferrer"
        className={footerStyles.footer__iconContainer}
        aria-label="Click here to access my Twitter profile"
      >
        <FontAwesomeIcon
          icon={faTwitter}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        href="https://www.linkedin.com/in/wentjun/"
        target="_blank"
        rel="noopener noreferrer"
        className={footerStyles.footer__iconContainer}
        aria-label="Click here to access my Linkedin profile"
      >
        <FontAwesomeIcon
          icon={faLinkedinIn}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        href="https://github.com/wentjun"
        target="_blank"
        rel="noopener noreferrer"
        className={footerStyles.footer__iconContainer}
        aria-label="Click here to access my Github repository"
      >
        <FontAwesomeIcon
          icon={faGithub}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        href="https://medium.com/@wentjun"
        target="_blank"
        rel="noopener noreferrer"
        className={footerStyles.footer__iconContainer}
        aria-label="Click here to read my freeCodeCamp articles"
      >
        <FontAwesomeIcon
          icon={faMediumM}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        href="https://www.freecodecamp.org/news/author/wentjun/"
        target="_blank"
        rel="noopener noreferrer"
        className={footerStyles.footer__iconContainer}
        aria-label="Check out my freeCodeCamp articles"
      >
        <FontAwesomeIcon
          icon={faFreeCodeCamp}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        href="https://stackoverflow.com/users/10959940/wentjun"
        target="_blank"
        rel="noopener noreferrer"
        className={footerStyles.footer__iconContainer}
        aria-label="Check out my Stack Overflow profile"
      >
        <FontAwesomeIcon
          icon={faStackOverflow}
          className={footerStyles.footer__icon}
        />
      </a>
      <a
        href="mailto: wentjun289@hotmail.com"
        className={footerStyles.footer__iconContainer}
        aria-label="Email me at wentjun289@hotmail.com"
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          className={footerStyles.footer__icon}
        />
      </a>
      <span className={footerStyles.footer__label}>
        Made with{' '}
        <span className={footerStyles.footer__heartIcon}>&#9829;</span> using{' '}
        <a
          href="https://www.gatsbyjs.org/"
          rel="noopener noreferrer"
          target="_blank"
        >
          GatsbyJS
        </a>
      </span>
    </div>
  </footer>
);

export default Footer;