import { GoogleAnalyticsConfig } from '../config/app-config';
import AboutMeButton from '../components/about-me-button/about-me-button';
import CodeWindow from '../components/code-window/code-window';
import ContentSection from '../components/content-section/content-section';
import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import styles from './app.module.scss';

///////////////////////////////////////////////////////////////////////////////
// #region React Events                                                      //
///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// #endregion React Events                                                   //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// #region React Render                                                      //
///////////////////////////////////////////////////////////////////////////////

export default () => {
  const sectionRef = useRef<null | HTMLDivElement>(null);

  /**
   * Initialize Google Analytics to monitor visitor interactions.
   */
  useEffect(() => {
    ReactGA.initialize(GoogleAnalyticsConfig.GA_MEASUREMENT_ID);
    ReactGA.send('pageview');
  });

  return (
    <>
      <header className={styles.wrapper}>
        <CodeWindow />
        <AboutMeButton reactGA={ReactGA} sectionRef={sectionRef} />
      </header>
      <ContentSection reactGA={ReactGA} sectionRef={sectionRef} />
    </>
  );
};

///////////////////////////////////////////////////////////////////////////////
// #endregion React Render                                                   //
///////////////////////////////////////////////////////////////////////////////
