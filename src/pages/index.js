import React from 'react';
import smoothscroll from 'smoothscroll-polyfill';

import Contact from '../components/contact';
import Footer from '../components/footer';
import Landing from '../components/landing';
import PersonalProjects from '../components/personal-projects';
import Spotlight from '../components/spotlight';

// Polyfill for Scroll Behaviour as part Window interface. Allows support for IE, and Safari.
smoothscroll.polyfill();

export default () => (
  <div>
    <Landing />
    <Spotlight />
    <PersonalProjects />
    <Contact />
    <Footer />
  </div>
);
