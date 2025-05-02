import { CodeImage, MailboxClosedEmoji, MailboxOpenedEmoji, WaveEmoji } from '../../assets/images';
import { cssTimeToMilliseconds } from '../../utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { ReactComponent as AvatarIcon } from '../../assets/icons/avatar_icon.svg';
import { ReactComponent as GitHubIcon } from '../../assets/icons/github_icon.svg';
import { ReactComponent as ScrollIcon } from '../../assets/icons/scroll_icon.svg';
import { setAvatarUrl, setIsArticle1Visible, setIsArticle2Visible, setIsHandWaveAnimated, setIsMailboxAnimatedClosed, setIsMailboxAnimatedOpened, setIsMailboxImageOpened, setIsSectionVisible } from '../../stores/content-section-slice';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './content-section.module.scss';
import type { RootState, AppDispatch } from '../../stores';
import variables from '../../styles/_variables.module.scss';

/**
 * The section containing articles and footer buttons. This is animated in when
 * the visitor scrolls far enough down on the page.
 * @returns {React.JSX.Element}
 */
const ContentSection = ({
  reactGA,
  sectionRef
}: {
  reactGA: GA4
  sectionRef: React.MutableRefObject<HTMLDivElement | null>
}): React.JSX.Element => {
  // Load the state from Redux.
  const dispatch = useDispatch<AppDispatch>();
  const avatarUrl = useSelector((state: RootState) => state.contentSection.avatarUrl);
  const isArticle1Visible = useSelector((state: RootState) => state.contentSection.isArticle1Visible);
  const isArticle2Visible = useSelector((state: RootState) => state.contentSection.isArticle2Visible);
  const isCodeWindowInitialized = useSelector((state: RootState) => state.codeWindow.isInitialized);
  const isHandWaveAnimated = useSelector((state: RootState) => state.contentSection.isHandWaveAnimated);
  const isMailboxAnimatedClosed = useSelector((state: RootState) => state.contentSection.isMailboxAnimatedClosed);
  const isMailboxAnimatedOpened = useSelector((state: RootState) => state.contentSection.isMailboxAnimatedOpened);
  const isMailboxImageOpened = useSelector((state: RootState) => state.contentSection.isMailboxImageOpened);
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

  // Animate the section contents based on their delayed configurations.
  React.useEffect(() => {
    if (!isSectionVisible) return;

    const article1Delay =
      cssTimeToMilliseconds(variables.sectionTransitionDurationInitialize);

    const article1Timeout = setTimeout(() =>
      dispatch(setIsArticle1Visible(true)), // TODO: hidden?
      article1Delay
    );

    const article2Delay =
      article1Delay + cssTimeToMilliseconds(variables.sectionArticleTransitionDurationInitialize);

    const article2Timeout = setTimeout(() =>
      dispatch(setIsArticle2Visible(true)),
      article2Delay
    );

    const handWaveDelay =
      article2Delay + cssTimeToMilliseconds(variables.sectionArticleTransitionDurationInitialize);

    const handWaveTimeout = setTimeout(() =>
      dispatch(setIsHandWaveAnimated(true)),
      handWaveDelay
    );

    const mailboxClosedDelay =
      handWaveDelay + cssTimeToMilliseconds(variables.sectionArticleTransitionDurationHandWave);

    const mailboxClosedTimeout = setTimeout(() => {
      dispatch(setIsHandWaveAnimated(false));
      dispatch(setIsMailboxAnimatedClosed(true));
    }, mailboxClosedDelay);

    const mailboxOpenedDelay =
      mailboxClosedDelay + (cssTimeToMilliseconds(variables.sectionArticleTransitionDurationMailbox) / 2);

    const mailboxOpenedTimeout = setTimeout(() => {
      dispatch(setIsMailboxAnimatedClosed(false));
      dispatch(setIsMailboxAnimatedOpened(true));
      dispatch(setIsMailboxImageOpened(true));
    }, mailboxOpenedDelay);

    const finalAnimationTimeout = setTimeout(() =>
      dispatch(setIsMailboxAnimatedOpened(false)),
      mailboxOpenedDelay + (cssTimeToMilliseconds(variables.sectionArticleTransitionDurationMailbox) / 2)
    );

    return () => {
      clearTimeout(article1Timeout);
      clearTimeout(article2Timeout);
      clearTimeout(handWaveTimeout);
      clearTimeout(mailboxClosedTimeout);
      clearTimeout(mailboxOpenedTimeout);
      clearTimeout(finalAnimationTimeout);
    };
  }, [isSectionVisible]);

  const article1Classes = classNames(styles.article, { [styles.hidden]: !isArticle1Visible });
  const article2Classes = classNames(styles.article, { [styles.hidden]: !isArticle2Visible });
  const handWaveClasses = classNames({ [styles.handWave]: isHandWaveAnimated });
  const sectionClasses = classNames(styles.section, { [styles.hidden]: !isSectionVisible });

  const mailboxClasses = classNames({
    [styles.mailboxTranslate]: isMailboxAnimatedClosed && !isMailboxAnimatedOpened,
    [styles.mailboxRotate]: isMailboxAnimatedOpened
  });

  const mailboxEmoji = isMailboxImageOpened
    ? MailboxOpenedEmoji
    : MailboxClosedEmoji;

  return (
    <section className={sectionClasses} ref={sectionRef}>
      <article className={article1Classes}>
        {avatarUrl ? <img src={avatarUrl} alt="avatar" draggable="false" /> : <AvatarIcon />}
        <p>
          Hello! <img src={WaveEmoji} className={handWaveClasses} alt="waving emoji" /> My name is{' '}
          <a
            href="https://www.linkedin.com/in/auwilliams"
            onClick={onLinkedInClick}
            rel="noopener noreferrer"
            target="_blank"
          >
            Austin
          </a>
          . I started my career by developing government programs and collaborating with major tech
          companies who taught me their art of delivering great software from start to finish.
        </p>
      </article>
      <article className={article2Classes}>
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
          is sharable online and you can reach me for employment inquiries by email at{' '}
          <a href="mailto:me@austinwilliams.dev" onClick={onEmailClick}>
            me@austinwilliams.dev
          </a>
          . <img src={mailboxEmoji} className={mailboxClasses} alt="mailbox emoji" />
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
