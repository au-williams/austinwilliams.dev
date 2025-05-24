import { GoogleAnalyticsConfig } from '@/config/app-config';
import AboutButton from '@/components/about-button/about-button';
import CodeWindow from '@/components/code-window/code-window';
import ContentSection from '@/components/content-section/content-section';
import React from 'react';
import ReactGA from 'react-ga4';
import styles from './app.module.scss';
import RedirectPopup from '@/components/redirect-popup/redirect-popup';
import { useNavigate } from 'react-router';
import DebugMode from '@/components/debug-mode/debug-mode';

///////////////////////////////////////////////////////////////////////////////
// #region React Render                                                      //
///////////////////////////////////////////////////////////////////////////////

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
  const navigate = useNavigate();

  React.useEffect(() => {
    // Start Google Analytics and send startup analytics event.
    ReactGA.initialize(GoogleAnalyticsConfig.GA_MEASUREMENT_ID);
    ReactGA.send('pageview');
    // Reset scroll position to top on page load.
    window.history.scrollRestoration = 'manual';
  }, [navigate]);

  return (
    <>
      <DebugMode />
      <RedirectPopup
        reactGA={ReactGA}
        redirectFavicon={redirectFavicon}
        redirectDestination={redirectDestination}
        redirectName={redirectName}
        redirectShareLink={redirectShareLink}
      />
      <header className={styles['wrapper']}>
        <CodeWindow />
        <AboutButton reactGA={ReactGA} sectionRef={sectionRef} />
      </header>
      <ContentSection reactGA={ReactGA} sectionRef={sectionRef} />
    </>
  );
};

export default App;

///////////////////////////////////////////////////////////////////////////////
// #endregion React Render                                                   //
///////////////////////////////////////////////////////////////////////////////
