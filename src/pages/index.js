import React from 'react';

import Contact from '../components/contact';
import Landing from '../components/landing';
import PersonalProjects from '../components/personal-projects';
import Spotlight from '../components/spotlight';

export default () => (
  <div>
    <Landing />
    <Spotlight />
    <PersonalProjects />
    <Contact />
  </div>
);
