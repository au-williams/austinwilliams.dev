import { GoogleAnalyticsConfig } from '@/config/app-config';
import AboutButton from '@/components/about-button/about-button';
import CodeWindow from '@/components/code-window/code-window';
import ContentSection from '@/components/content-section/content-section';
import React from 'react';
import ReactGA from 'react-ga4';
import RedirectPopup from '@/components/redirect-popup/redirect-popup';
import styles from './app.module.scss';

const App = ({
  redirectFavicon,
  redirectDestination,
  redirectName,
  redirectShareLink,
}: {
  redirectFavicon?: string;
  redirectDestination?: string;
  redirectName?: string;
  redirectShareLink?: string;
}) => {
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    // Start Google Analytics and send startup analytics event.
    ReactGA.initialize(GoogleAnalyticsConfig.GA_MEASUREMENT_ID);
    ReactGA.send('pageview');
    // Reset scroll position to top on page load.
    window.history.scrollRestoration = 'manual';
  }, []);

  return (
    <>
      <RedirectPopup
        reactGA={ReactGA}
        redirectFavicon={redirectFavicon}
        redirectDestination={redirectDestination}
        redirectName={redirectName}
        redirectShareLink={redirectShareLink}
      />
      <header className={styles['header']}>
        <CodeWindow />
        <AboutButton reactGA={ReactGA} sectionRef={sectionRef} />
      </header>
      <ContentSection reactGA={ReactGA} sectionRef={sectionRef} />
    </>
  );
};

export default App;
