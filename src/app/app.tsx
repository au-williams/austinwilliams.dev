import { GoogleAnalyticsConfig } from '../config/app-config';
import AboutButton from '../components/about-button/about-button';
import CodeWindow from '../components/code-window/code-window';
import ContentSection from '../components/content-section/content-section';
import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import styles from './app.module.scss';

///////////////////////////////////////////////////////////////////////////////
// #region React Render                                                      //
///////////////////////////////////////////////////////////////////////////////

export default () => {
  const sectionRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Start Google Analytics and send startup analytics event.
    ReactGA.initialize(GoogleAnalyticsConfig.GA_MEASUREMENT_ID);
    ReactGA.send('pageview');
    // Reset scroll position to top on page load.
    window.history.scrollRestoration = 'manual';
  });

  return (
    <>
      <header className={styles.wrapper}>
        <CodeWindow />
        <AboutButton reactGA={ReactGA} sectionRef={sectionRef} />
      </header>
      <ContentSection reactGA={ReactGA} sectionRef={sectionRef} />
    </>
  );
};

///////////////////////////////////////////////////////////////////////////////
// #endregion React Render                                                   //
///////////////////////////////////////////////////////////////////////////////
