import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { CodeImage, MailboxEmoji, WaveEmoji } from '../assets/images';
import { GoogleAnalyticsConfig } from '../config/app-config';
import { ReactComponent as ChevronIcon } from '../assets/icons/chevron-down-solid.svg';
import { ReactComponent as AvatarIcon } from '../assets/icons/avatar_icon.svg';
import { ReactComponent as GitHubIcon } from '../assets/icons/github_icon.svg';
import { ReactComponent as ScrollIcon } from '../assets/icons/scroll_icon.svg';
import AboutMeButton from '../components/about-me-button/about-me-button';
import CodeWindow from '../components/code-window/code-window';
import styles from './app.module.scss';

///////////////////////////////////////////////////////////////////////////////
// #region Google Analytics                                                  //
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize Google Analytics to monitor visitor interactions.
 * (This key isn't sensitive and isn't required to be secreted)
 */
const startGoogleAnalytics = () => {
  ReactGA.initialize(GoogleAnalyticsConfig.GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
};

/**
 * The base function to send events to Google Analytics.
 * @param {string} category The Google Analytics event category
 * @param {string} action The Google Analytics event action
 */
const sendGoogleAnalyticsEvent = (category: string, action: string) =>
  ReactGA.event({ category, action });

///////////////////////////////////////////////////////////////////////////////
// #endregion Google Analytics                                               //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// #region React Events                                                      //
///////////////////////////////////////////////////////////////////////////////

/**
 * Sends a Google Analytics event when the back to top button is clicked and
 * scrolls the web client back to the top of the page.
 */
const onBackClick = () => {
  sendGoogleAnalyticsEvent('click', 'back_to_top_button');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Sends a Google Analytics event when the email link is clicked.
 */
const onEmailClick = () => sendGoogleAnalyticsEvent('click', 'email_mailto_link');

/**
 * Sends a Google Analytics event when the GitHub link is clicked.
 */
const onGitHubClick = () => sendGoogleAnalyticsEvent('click', 'github_outbound_link');

/**
 * Sends a Google Analytics event when the LinkedIn link is clicked.
 */
const onLinkedInClick = () => sendGoogleAnalyticsEvent('click', 'linkedin_outbound_link');

/**
 * Sends a Google Analytics event when the resume link is clicked.
 */
const onResumeClick = () => sendGoogleAnalyticsEvent('click', 'resume_outbound_link');

///////////////////////////////////////////////////////////////////////////////
// #endregion React Events                                                   //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// #region React Render                                                      //
///////////////////////////////////////////////////////////////////////////////

export default () => {
  const [avatar, setAvatar] = useState<null | string>(null);
  const sectionRef = useRef<null | HTMLDivElement>(null);

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
   * Sends a Google Analytics event when the about button's clicked and scrolls
   * the web client down beyond the landing and to the start of the sectionRef.
   */
  const onAboutClick = () => {
    sendGoogleAnalyticsEvent('click', 'about_button');
    sectionRef.current!.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    startGoogleAnalytics();
    fetchSetGitHubAvatar();
  });

  return (
    <>
      <header className={styles.wrapper}>
        <CodeWindow />
        <AboutMeButton onClick={onAboutClick} />
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
            . I started my career by developing government programs and collaborating with major
            tech companies who taught me their art of delivering great software from start to
            finish.
          </p>
        </article>
        <article className={styles.article}>
          <img src={CodeImage} alt="banner" draggable="false" />
          <p>
            I love working with computers and I&apos;m always open to new opportunities. My{' '}
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
