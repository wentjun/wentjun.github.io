import {
  faUniversity,
  faChartPie,
  faLaptopCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import * as PersonalProjectsStyles from './personal-projects.module.css';

const PersonalProjects = () => (
  <section id="personal-projects" className="wrapper">
    <div className="container">
      <header className="text-center">
        <h2>Some of my Work</h2>
        <p>This is a list of side projects I had worked on.</p>
      </header>
      <div className="row text-center">
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <h3>COVID-19 Initiatives</h3>
          <p>{/*<i></i>*/}</p>
          <p>
            <a
              href="https://github.com/wentjun/covid-19-sg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Data Source
            </a>{' '}
            of COVID-19/Coronavirus cases and cluster locations in Singapore,
            which includes metadata such as hospitalisation/discharge dates and
            news summaries. Data is scraped from local news sources and
            government websites using Cheerio and Node.js. This has extended
            into a visualisation project{' '}
            <a
              href="https://covid-tracker.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              covid-tracker.com
            </a>{' '}
            which provides insights about the development of COVID-19 in
            Singapore. The web project is built with React, TypeScript, Redux,
            Redux Observable, RxJS, Styled Components, and Mapbox.
          </p>
        </section>
        <section className={PersonalProjectsStyles.PersonalProjects__column}>
          <h3>Visualisations with D3.js</h3>
          <p>{/*<i></i>*/}</p>
          <p>
            Recreated{' '}
            <a
              href="https://wentjun.com/d3-historical-prices-data-joins/"
              target="_blank"
              rel="noopener noreferrer"
            >
              historical price charts
            </a>{' '}
            of financial instruments (
            <a
              href="https://github.com/wentjun/d3-historical-prices-data-joins"
              target="_blank"
              rel="noopener noreferrer"
            >
              source code
            </a>
            ). Published several beginner friendly{' '}
            <a
              href="https://www.freecodecamp.org/news/author/wentjun/"
              target="_blank"
              rel="noopener noreferrer"
            >
              guides about D3.js
            </a>{' '}
            on freeCodeCamp.
          </p>
          <p>
            Visualised the lineage of the top Brazilian Jiu-jitsu competitors,
            practioners, and coaches using a dendogram/tree structure (
            <a
              href="https://github.com/wentjun/bjj-lineage-tree"
              target="_blank"
              rel="noopener noreferrer"
            >
              source code
            </a>
            ).
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

export default PersonalProjects;
