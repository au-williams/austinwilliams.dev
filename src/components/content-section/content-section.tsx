import { CodeImage, MailboxClosedEmoji, MailboxOpenedEmoji, WaveEmoji } from '@/assets/images';
import { ContactEmailAddress, favicons, GithubConfig } from '@/config/app-config';
import { cssTimeToMilliseconds } from '@/utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import * as slice from '@/redux/content-section-slice';
import AvatarIcon from '@/assets/icons/avatar_icon.svg?react';
import classNames from 'classnames';
import GitHubIcon from '@/assets/icons/github_icon.svg?react';
import HoverTooltip from '../hover-tooltip/hover-tooltip';
import React from 'react';
import ScrollIcon from '@/assets/icons/scroll_icon.svg?react';
import styles from './content-section.module.scss';
import type { RootState, AppDispatch } from '@/redux';
import variables from '@/styles/_variables.module.scss';

/**
 * The section containing articles and footer buttons. This is animated in when
 * the visitor scrolls far enough down on the page.
 * @returns {React.JSX.Element}
 */
const ContentSection = ({
  reactGA,
  sectionRef,
}: {
  reactGA: GA4;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element => {
  /////////////////////////////////////////////////////////////////////////////
  // #region Component props                                                 //
  /////////////////////////////////////////////////////////////////////////////

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

  const article1Classes = classNames([styles.article, styles[isArticle1Visible ? 'visible' : 'hidden']]);
  const article2Classes = classNames([styles.article, styles[isArticle2Visible ? 'visible' : 'hidden']]);
  const handWaveClasses = classNames({ [styles['handWave']]: isHandWaveAnimated });
  const sectionClasses = classNames([styles.section, styles[isSectionVisible ? 'visible' : 'hidden']]);

  const mailboxClasses = classNames({
    [styles.mailboxTranslate]: isMailboxAnimatedClosed && !isMailboxAnimatedOpened,
    [styles.mailboxRotate]: isMailboxAnimatedOpened,
  });

  const mailboxEmoji = isMailboxImageOpened ? MailboxOpenedEmoji : MailboxClosedEmoji;

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component props                                              //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component hooks                                                 //
  /////////////////////////////////////////////////////////////////////////////

  // Fetch the avatar from my GitHub profile and set it as this avatar image.
  React.useEffect(() => {
    fetch(GithubConfig.GITHUB_USER_URL)
      .then((res) => res.json())
      .then((result) => dispatch(slice.setAvatarUrl(result.avatar_url)))
      .catch((error) => console.error('Error:', error));
  }, [dispatch]);

  // Display the content section on scroll after code window is initialized.
  React.useEffect(() => {
    if (!isCodeWindowInitialized) return;

    /**
     * "The ref value containerRef.current will likely have changed by the time
     * this effect cleanup function runs. If this ref points to a node rendered
     * by React, copy ref.current to a variable inside the effect, and use that
     * variable in the cleanup function. (react-hooks/exhaustive-deps)"
     * https://stackoverflow.com/a/67069936
     */
    let observerRefValue: HTMLDivElement | null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        dispatch(slice.setIsSectionVisible(true));
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      observerRefValue = sectionRef.current;
    }
    return () => {
      if (!observerRefValue) return;
      observer.unobserve(observerRefValue);
    };
  }, [dispatch, isCodeWindowInitialized, sectionRef]);

  // Animate the section contents based on their delayed configurations.
  React.useEffect(() => {
    if (!isSectionVisible) return;

    const displayContent = () => {
      const durationInitialization = cssTimeToMilliseconds(variables.sectionArticleTransitionDurationInitialize);
      const durationHandWave = cssTimeToMilliseconds(variables.sectionArticleTransitionDurationHandWave);
      const durationMailbox = cssTimeToMilliseconds(variables.sectionArticleTransitionDurationMailbox) / 2; // We play 2 animations, so divide by 2

      dispatch(slice.setIsArticle1Visible(true));

      const article2Delay = durationInitialization;
      setTimeout(() => dispatch(slice.setIsArticle2Visible(true)), article2Delay);

      const handWaveDelay = article2Delay + durationInitialization;
      setTimeout(() => dispatch(slice.setIsHandWaveAnimated(true)), handWaveDelay);

      const mailboxClosedDelay = handWaveDelay + durationHandWave;
      setTimeout(() => {
        dispatch(slice.setIsHandWaveAnimated(false));
        dispatch(slice.setIsMailboxAnimatedClosed(true));
      }, mailboxClosedDelay);

      const mailboxOpenedDelay = mailboxClosedDelay + durationMailbox;
      setTimeout(() => {
        dispatch(slice.setIsMailboxAnimatedClosed(false));
        dispatch(slice.setIsMailboxAnimatedOpened(true));
        dispatch(slice.setIsMailboxImageOpened(true));
      }, mailboxOpenedDelay);

      setTimeout(
        () => dispatch(slice.setIsMailboxAnimatedOpened(false)),
        mailboxOpenedDelay + cssTimeToMilliseconds(variables.sectionArticleTransitionDurationMailbox) / 2,
      );
    };

    setTimeout(displayContent, cssTimeToMilliseconds(variables.sectionTransitionDurationInitialize));
  }, [dispatch, isSectionVisible]);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component hooks                                              //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component funcs                                                 //
  /////////////////////////////////////////////////////////////////////////////

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
  const onEmailClick = () => {
    reactGA.event({ category: 'click', action: 'email_mailto_link' });
  };

  const handWaveOnMouseOver = () => {
    if (isHandWaveAnimated) return;
    dispatch(slice.setIsHandWaveAnimated(true));
    const duration = cssTimeToMilliseconds(variables.sectionArticleTransitionDurationHandWave);
    setTimeout(() => dispatch(slice.setIsHandWaveAnimated(false)), duration);
  };

  const mailboxOnMouseOver = () => {
    if (isMailboxAnimatedClosed || isMailboxAnimatedOpened) return;
    dispatch(slice.setIsMailboxAnimatedOpened(true));
    const duration = cssTimeToMilliseconds(variables.sectionArticleTransitionDurationMailbox) / 2;
    setTimeout(() => dispatch(slice.setIsMailboxAnimatedOpened(false)), duration);
  };

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component funcs                                              //
  /////////////////////////////////////////////////////////////////////////////

  return (
    <section className={sectionClasses} ref={sectionRef}>
      <article className={article1Classes}>
        {avatarUrl ? <img src={avatarUrl} alt="avatar" draggable="false" /> : <AvatarIcon />}
        <div>
          Hello!{' '}
          <img src={WaveEmoji} className={handWaveClasses} onMouseOver={handWaveOnMouseOver} alt="waving emoji" />{' '}
          My name is{' '}
          <HoverTooltip hoverTooltipId={'LinkedIn'} img={favicons.LINKEDIN} text={'LinkedIn'}>
            <Link to="/linkedin" replace>
              Austin
            </Link>
          </HoverTooltip>
          . I started my career by developing government programs and collaborating with major tech companies who
          taught me their art of delivering great software from start to finish.
        </div>
      </article>
      <article className={article2Classes}>
        <img src={CodeImage} alt="banner" draggable="false" />
        <div>
          I love working with computers and I&apos;m always open to new opportunities. My{' '}
          <HoverTooltip hoverTooltipId={'Google Drive'} img={favicons.GOOGLE_DRIVE} text={'Google Drive'}>
            <Link to="/resume" replace>
              resume
            </Link>
          </HoverTooltip>{' '}
          is sharable online and you can reach me for employment inquiries by email at{' '}
          <HoverTooltip hoverTooltipId={'Send an email'} img={favicons.GMAIL} text={'Send an email'}>
            <a href={`mailto:${ContactEmailAddress}`} onClick={onEmailClick}>
              {ContactEmailAddress}
            </a>
          </HoverTooltip>
          .{' '}
          <img
            src={mailboxEmoji}
            className={mailboxClasses}
            onMouseOver={mailboxOnMouseOver}
            alt="mailbox emoji"
          />
        </div>
      </article>
      <footer className={styles.footer}>
        <button type="button" onClick={onBackClick}>
          <ScrollIcon /> Back to top
        </button>
        <Link to="/github" replace>
          <GitHubIcon /> GitHub
        </Link>
      </footer>
    </section>
  );
};

export default ContentSection;
