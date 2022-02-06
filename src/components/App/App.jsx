import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import { Avatar, GitHub, Scroll } from '../../assets/icons';
import { Banner, MailboxEmoji, WaveEmoji } from '../../assets/images';
import CodeWindow from '../CodeWindow/CodeWindow';
import styles from './App.module.scss';

// google analytics

const startGoogleAnalytics = () => {
  ReactGA.initialize('G-JFBLY5T1C0');
  ReactGA.send('pageview');
};

const sendGoogleAnalyticsEvent = (category, action) => ReactGA.event({ category, action });

// react events

const onBackClick = () => {
  sendGoogleAnalyticsEvent('click', 'back_to_top_button');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onGitHubClick = () => sendGoogleAnalyticsEvent('click', 'github_outbound_link');

// react render

const App = () => {
  const [avatar, setAvatar] = useState(Avatar);
  const sectionRef = useRef(null);

  const onAboutClick = () => {
    sendGoogleAnalyticsEvent('click', 'about_button');
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchGitHubAvatar = () => {
    fetch('https://api.github.com/users/au-williams')
      .then((res) => res.json())
      .then((result) => setAvatar(result.avatar_url))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    startGoogleAnalytics();
    fetchGitHubAvatar();
  });

  return (
    <>
      <header className={styles.viewportWrapper}>
        <CodeWindow />
        <button type="button" onClick={onAboutClick}>
          About
          <br />
          &darr;
        </button>
      </header>
      <section className={styles.appSection} ref={sectionRef}>
        <article className={styles.flexWrapper}>
          <img src={avatar} alt="avatar" draggable="false" />
          <p>
            Hey <img src={WaveEmoji} alt="waving emoji" /> — My name is{' '}
            <a href="https://www.linkedin.com/in/auwilliams">Austin</a>. I started my career by
            developing government programs and collaborating with major tech companies, who taught
            me their art of delivering great software from start to finish.
          </p>
        </article>
        <article className={styles.flexWrapper}>
          <img src={Banner} alt="banner" draggable="false" />
          <p>
            I love working with computers and I&apos;m always open to new opportunities. Feel free
            to send an email for side-work or employment inquiries — you can reach me at{' '}
            <a href="mailto:me@austinwilliams.dev">me@austinwilliams.dev</a>.{' '}
            <img src={MailboxEmoji} alt="mailbox emoji" />
          </p>
        </article>
        <footer className={styles.appFooter}>
          <button type="button" onClick={onBackClick}>
            <img src={Scroll} alt="return icon" />
            Back to top
          </button>
          <a
            href="https://github.com/au-williams/au-williams.github.io"
            onClick={onGitHubClick}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img src={GitHub} alt="github" />
            GitHub
          </a>
        </footer>
      </section>
    </>
  );
};

export default App;
