import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { ReactComponent as AvatarIcon } from '../assets/icons/avatar_icon.svg';
import { ReactComponent as GitHubIcon } from '../assets/icons/github_icon.svg';
import { ReactComponent as ScrollIcon } from '../assets/icons/scroll_icon.svg';
import { CodeImage, MailboxEmoji, WaveEmoji } from '../assets/images';
import CodeWindow from '../components/code-window/code-window.tsx';
import styles from './app.module.scss';

///////////////////////////////////////////////////////////////////////////////
// #region Google Analytics                                                  //
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize Google Analytics to monitor visitor interactions.
 * (This key isn't sensitive and isn't required to be secreted)
 */
const startGoogleAnalytics = () => {
  ReactGA.initialize('G-JFBLY5T1C0');
  ReactGA.send('pageview');
};

/**
 * The base function to send events to Google Analytics.
 * @param {string} category The Google Analytics event category
 * @param {string} action The Google Analytics event action
 * @returns {*}
 */
const sendGoogleAnalyticsEvent = (category, action) => ReactGA.event({ category, action });

///////////////////////////////////////////////////////////////////////////////
// #endregion Google Analytics                                               //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// #region React Events                                                      //
///////////////////////////////////////////////////////////////////////////////

const onBackClick = () => {
  sendGoogleAnalyticsEvent('click', 'back_to_top_button');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Sends a Google Analytics event when the email link is clicked.
 * @returns {void}
 */
const onEmailClick = () => sendGoogleAnalyticsEvent('click', 'email_mailto_link');

/**
 * Sends a Google Analytics event when the GitHub link is clicked.
 * @returns {void}
 */
const onGitHubClick = () => sendGoogleAnalyticsEvent('click', 'github_outbound_link');

/**
 * Sends a Google Analytics event when the LinkedIn link is clicked.
 * @returns {void}
 */
const onLinkedInClick = () => sendGoogleAnalyticsEvent('click', 'linkedin_outbound_link');

/**
 * Sends a Google Analytics event when the resume link is clicked.
 * @returns {void}
 */
const onResumeClick = () => sendGoogleAnalyticsEvent('click', 'resume_outbound_link');

///////////////////////////////////////////////////////////////////////////////
// #endregion React Events                                                   //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// #region React Render                                                      //
///////////////////////////////////////////////////////////////////////////////

const App = () => {
  const [avatar, setAvatar] = useState(null);
  const sectionRef = useRef(null);

  /**
   * Fetch the avatar from my GitHub profile and set it as this avatar image.
   */
  const fetchSetGitHubAvatar = () => {
    fetch('https://api.github.com/users/au-williams')
      .then((res) => res.json())
      .then((result) => setAvatar(result.avatar_url))
      .catch((error) => console.error('Error:', error));
  };

  /**
   * Sends a Google Analytic event when the about button is clicked and scrolls
   * the page downwards beyond the landing and to the start of the sectionRef.
   */
  const onAboutClick = () => {
    sendGoogleAnalyticsEvent('click', 'about_button');
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    startGoogleAnalytics();
    fetchSetGitHubAvatar();
  });

  return (
    <>
      <header className={styles.wrapper}>
        <CodeWindow />
        <button type="button" onClick={onAboutClick}>
          About
          <br />
          &darr;
        </button>
      </header>
      <section className={styles.section} ref={sectionRef}>
        <article className={styles.article}>
          {avatar ? <img src={avatar} alt="avatar" draggable="false" /> : <AvatarIcon />}
          <p>
            Hey <img src={WaveEmoji} alt="waving emoji" /> — My name is{' '}
            <a
              href="https://www.linkedin.com/in/auwilliams"
              onClick={onLinkedInClick}
              rel="noopener noreferrer"
              target="_blank"
            >
              Austin
            </a>
            . I started my career by developing government programs and
            collaborating with major tech companies who taught me their art of
            delivering great software from start to finish.
          </p>
        </article>
        <article className={styles.article}>
          <img src={CodeImage} alt="banner" draggable="false" />
          <p>
            I love working with computers and I&apos;m always open to new
            opportunities. My{' '}
            <a
              href="https://resume.austinwilliams.dev/"
              onClick={onResumeClick}
              rel="noopener noreferrer"
              target="_blank"
            >
              resume
            </a>{' '}
            is available online and you can email me for any employment inquiries at{' '}
            <a href="mailto:me@austinwilliams.dev" onClick={onEmailClick}>
              me@austinwilliams.dev
            </a>
            . <img src={MailboxEmoji} alt="mailbox emoji" />
          </p>
        </article>
        <footer className={styles.footer}>
          <button type="button" onClick={onBackClick}>
            <ScrollIcon /> Back to top
          </button>
          <a
            href="https://github.com/au-williams/au-williams.github.io"
            onClick={onGitHubClick}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon /> GitHub
          </a>
        </footer>
      </section>
    </>
  );
};

///////////////////////////////////////////////////////////////////////////////
// #endregion React Render                                                   //
///////////////////////////////////////////////////////////////////////////////

export default App;
