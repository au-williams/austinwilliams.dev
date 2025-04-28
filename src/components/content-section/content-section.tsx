import { CodeImage, MailboxEmoji, WaveEmoji } from '../../assets/images';
import { cssTimeToMilliseconds } from '../../utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { ReactComponent as AvatarIcon } from '../../assets/icons/avatar_icon.svg';
import { ReactComponent as GitHubIcon } from '../../assets/icons/github_icon.svg';
import { ReactComponent as ScrollIcon } from '../../assets/icons/scroll_icon.svg';
import { setAvatarUrl, setIsArticle1Visible, setIsArticle2Visible, setIsSectionVisible } from '../../stores/content-section-slice';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styles from './content-section.module.scss';
import type { RootState, AppDispatch } from '../../stores';
import variables from '../../styles/_variables.module.scss';

/**
 * @returns {React.JSX.Element}
 */
const ContentSection = ({
  reactGA,
  sectionRef
}: {
  reactGA: GA4
  sectionRef: React.MutableRefObject<HTMLDivElement | null>
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const avatarUrl = useSelector((state: RootState) => state.contentSection.avatarUrl);
  const isArticle1Visible = useSelector((state: RootState) => state.contentSection.isArticle1Visible);
  const isArticle2Visible = useSelector((state: RootState) => state.contentSection.isArticle2Visible);
  const isCodeWindowInitialized = useSelector((state: RootState) => state.codeWindow.isInitialized);
  const isSectionVisible = useSelector((state: RootState) => state.contentSection.isSectionVisible);

  /**
   * Sends a Google Analytics event when the back to top button is clicked and
   * scrolls the web client back to the top of the page.
   */
  const onBackClick = () => {
    reactGA.event({ category: 'click', action: 'back_to_top_button' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Sends a Google Analytics event when the email link is clicked.
   */
  const onEmailClick = () =>
    reactGA.event({ category: 'click', action: 'email_mailto_link' });

  /**
   * Sends a Google Analytics event when the GitHub link is clicked.
   */
  const onGitHubClick = () =>
    reactGA.event({ category: 'click', action: 'github_outbound_link' });

  /**
   * Sends a Google Analytics event when the LinkedIn link is clicked.
   */
  const onLinkedInClick = () =>
    reactGA.event({ category: 'click', action: 'linkedin_outbound_link' });

  /**
   * Sends a Google Analytics event when the resume link is clicked.
   */
  const onResumeClick = () =>
    reactGA.event({ category: 'click', action: 'resume_outbound_link' });

  // Fetch the avatar from my GitHub profile and set it as this avatar image.
  React.useEffect(() => {
    fetch('https://api.github.com/users/au-williams')
      .then((res) => res.json())
      .then((result) => dispatch(setAvatarUrl(result.avatar_url)))
      .catch((error) => console.error('Error:', error));
  });

  // Display the content section on scroll after code window is initialized.
  React.useEffect(() => {
    if (!isCodeWindowInitialized) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        dispatch(setIsSectionVisible(true));
        observer.disconnect();
      }, { threshold: 0.1 }
    );

    observer.observe(sectionRef.current!);
    return () => observer.unobserve(sectionRef.current!);
  }, [isCodeWindowInitialized]);

  // Display article 1 after section is initialized.
  React.useEffect(() => {
    if (!isSectionVisible) return;
    // Delay the timeout by the transition duration to ensure the transition has ended.
    const delay: number = cssTimeToMilliseconds(variables.sectionTransitionDurationInitialize);
    const timeout = setTimeout(() => dispatch(setIsArticle1Visible(true)), delay); // TODO: hidden?
    return () => clearTimeout(timeout);
  }, [isSectionVisible]);

  // Display article 2 after section is initialized.
  React.useEffect(() => {
    if (!isArticle1Visible) return;
    // TODO: wave emoji animation after all is loaded!
    const delay: number = cssTimeToMilliseconds(variables.sectionArticleTransitionDurationInitialize);
    const timeout = setTimeout(() => dispatch(setIsArticle2Visible(true)), delay); // TODO: hidden?
    return () => clearTimeout(timeout);
  }, [isArticle1Visible]);

  // Display article 2 after section is initialized.
  // React.useEffect(() => {
  //   // TODO: wave emoji animation after all is loaded!
  //   const timeout = setTimeout(() => dispatch(setIsArticle2Visible(true)), delay); // TODO: hidden?
  //   return () => clearTimeout(timeout);
  // }, [isArticle2Visible]);

  const article1Classes = classNames(
    styles.article,
    { [styles.hidden]: !isArticle1Visible },
  )

  const article2Classes = classNames(
    styles.article,
    { [styles.hidden]: !isArticle2Visible },
  )

  const classes = classNames(
    styles.section,
    { [styles.hidden]: !isSectionVisible },
  );

  return (
    <section className={classes} ref={sectionRef}>
      <article className={article1Classes}>
        {avatarUrl ? <img src={avatarUrl} alt="avatar" draggable="false" /> : <AvatarIcon />}
        <p>
          Hello! <img src={WaveEmoji} alt="waving emoji" /> My name is{' '}
          <span>
            <a
              href="https://www.linkedin.com/in/auwilliams"
              onClick={onLinkedInClick}
              rel="noopener noreferrer"
              target="_blank"
            >
              Austin
            </a>
          </span>
          . I started my career by developing government programs and collaborating with major tech
          companies who taught me their art of delivering great software from start to finish.
        </p>
      </article>
      <article className={article2Classes}>
        <img src={CodeImage} alt="banner" draggable="false" />
        <p>
          I love working with computers and I&apos;m always open to new opportunities. My{' '}
          <span>
            <a
              href="https://resume.austinwilliams.dev/"
              onClick={onResumeClick}
              rel="noopener noreferrer"
              target="_blank"
            >
              resume
            </a>
          </span>
          {' '}
          is available online and you can email me for any employment inquiries at{' '}
          <span>
            <a href="mailto:me@austinwilliams.dev" onClick={onEmailClick}>
              me@austinwilliams.dev
            </a>
          </span>
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
  );
};

ContentSection.propTypes = {
  reactGA: PropTypes.object.isRequired,
  sectionRef: PropTypes.object.isRequired
};

export default ContentSection;
