import {
  faUniversity,
  faChartPie,
  faLaptopCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import PersonalProjectsStyles from './personal-projects.module.css';

export default () => (
  <section id="personal-projects" className="wrapper">
    <div className="container">
      <header className="text-center">
        <h2>Some of my Work</h2>
        <p>This is a list of side projects I had worked on.</p>
      </header>
      <div className="row text-center">
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <h3>Capsule</h3>
          <p>
            <i>Product Design, Front-end Developer</i>
          </p>
          <p>
            <a
              href="https://capsule.sg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Capsule
            </a>{' '}
            aims to become a global mobile platform for organisations and
            quality content producers around the world to manage and showcase
            their valuable micro-content. Recently received funding of S$10,000
            from the NUS School of Computing as part of the Innovation &
            Entrepreneurship Practicum Award. Developed the low and high
            fidelity prototype for the application, as well as building it with
            Vue.js.
          </p>
        </section>
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <h3>MyPAP</h3>
          <p>
            <i>Interaction Designer</i>
          </p>
          <p>
            MyPAP(Project Administration Portal) ​aims ​to ​improve ​the ​whole
            ​internship ​experience for students of the National University of
            Singapore​, School of Computing, by ​making ​the ​portal ​simpler
            ​and ​more intuitive ​for them to deal with ​internship ​matters.
            ​These ​include ​matters ​from ​logging ​in and ​uploading ​their
            ​resumes, ​ to ​submitting ​their ​applications ​and ​turning ​in
            ​monthly ​progress reports. Feel free to click{' '}
            <a
              href="https://xd.adobe.com/view/1a1bb2b6-02df-49c4-9f6a-21276f078b48/"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>{' '}
            to explore the interactive prototype.
          </p>
        </section>
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <h3>Shuffle</h3>
          <p>
            <i>Front-end Developer</i>
          </p>
          <p>
            <a
              href="https://goshuffle.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shuffle
            </a>{' '}
            enhances the travel experience for backpackers by connecting them
            with like-minded travellers to explore new destinations together. In
            December 2018, I started working on this project with my fellow NUS
            Overseas College Alumni. I worked with Vue.js, and Google Cloud
            Firestore, to develop the web application.
          </p>
        </section>
      </div>
      <header className="text-center">
        <h2>I am always on the lookout for interesting projects.</h2>
        <p>
          If you would like to collaborate on any of the following areas, we
          should talk.
        </p>
      </header>
      <div className="row text-center">
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <span
            className={PersonalProjectsStyles.PersonalProjects__iconContainer}
          >
            <FontAwesomeIcon
              icon={faChartPie}
              className={PersonalProjectsStyles.PersonalProjects__icon}
            />
          </span>
          <h3>Data Visualisation</h3>
        </section>
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <span
            className={PersonalProjectsStyles.PersonalProjects__iconContainer}
          >
            <FontAwesomeIcon
              icon={faLaptopCode}
              className={PersonalProjectsStyles.PersonalProjects__icon}
            />
          </span>
          <h3>Open Source</h3>
        </section>
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <span
            className={PersonalProjectsStyles.PersonalProjects__iconContainer}
          >
            <FontAwesomeIcon
              icon={faUniversity}
              className={PersonalProjectsStyles.PersonalProjects__icon}
            />
          </span>
          <h3>Education</h3>
        </section>
      </div>
    </div>
  </section>
);
