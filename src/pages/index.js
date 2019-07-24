import { Helmet } from 'react-helmet';
import React from 'react';
import smoothscroll from 'smoothscroll-polyfill';

import Contact from '../components/contact';
import Footer from '../components/footer';
import Landing from '../components/landing';
import PersonalProjects from '../components/personal-projects';
import Spotlight from '../components/spotlight';

// Polyfill for Scroll Behaviour as part Window interface. Allows support for IE, and Safari.
if (typeof window !== 'undefined') {
  smoothscroll.polyfill();
}

export default () => (
  <div>
    <Helmet>
      <html lang="en" />
      <meta charSet="utf-8" />
      <meta
        name="Description"
        content="Hi, I am Wen Tjun. I am a full stack software engineer, specialising in front end development. Passionate about JavaScript, Web Development, and Design. Currently working as Senior Full Stack Developer at Splyt."
      />
      <title>Wen Tjun</title>
    </Helmet>
    <Landing />
    <Spotlight />
    <PersonalProjects />
    <Contact />
    <Footer />
  </div>
);
