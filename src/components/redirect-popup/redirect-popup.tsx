import { cssTimeToMilliseconds, pluralizeString } from '@/utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { HomeEmoji, LinkEmoji } from '@/assets/images';
import { RedirectPopupConfig } from '@/config/app-config';
import { RemoveScroll } from 'react-remove-scroll';
import { AppDispatch, type RootState } from '@/redux';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import * as slice from '@/redux/redirect-popup-slice';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import styles from './redirect-popup.module.scss';
import variables from '@/styles/_variables.module.scss';

/**
 * The redirect component handles redirecting window locations.
 */
const RedirectPopup = ({
  reactGA,
  redirectFavicon,
  redirectDestination,
  redirectName,
  redirectShareLink,
}: {
  reactGA: GA4;
  redirectFavicon?: string;
  redirectDestination?: string;
  redirectName?: string;
  redirectShareLink?: string;
}) => {
  /////////////////////////////////////////////////////////////////////////////
  // #region Component props                                                 //
  /////////////////////////////////////////////////////////////////////////////

  const navigate = useNavigate();

  const cachedDestination = useRef(redirectDestination);
  const cachedFavicon = useRef(redirectFavicon);
  const cachedName = useRef(redirectName);
  const popupRef = useRef<HTMLDivElement>(null);

  const [remainingSeconds, setRemainingSeconds] = useState(RedirectPopupConfig.COUNTDOWN_SECONDS);

  const dispatch = useDispatch<AppDispatch>();
  const isCopyable = useSelector((state: RootState) => state.redirectPopup.isCopyable);
  const isRedirecting = useSelector((state: RootState) => state.redirectPopup.isRedirecting);
  const isVisible = useSelector((state: RootState) => state.redirectPopup.isVisible);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component props                                              //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component funcs                                                 //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Navigate to the root route, closing this component. Don't navigate if this
   * was from a right click event (which happens on links).
   * @param {React.MouseEvent | undefined} event
   */
  const closePopup = React.useCallback(
    (event?: React.MouseEvent) => {
      // Do not navigate on right click.
      if (event?.button === 2) return;
      navigate('/');
    },
    [navigate],
  );

  /**
   * Copy the short link to the clipboard. Temporarily disable the copy button.
   */
  const copyUrl = React.useCallback(() => {
    if (!redirectShareLink) return;
    navigator.clipboard.writeText(redirectShareLink);
    dispatch(slice.setIsCopyable(false));
  }, [dispatch, redirectShareLink]);

  /**
   * Navigate to the root route to update the browser history and redirect the
   * window location.
   */
  const startRedirect = React.useCallback(() => {
    if (!redirectDestination) return;
    dispatch(slice.setIsRedirecting(true));
    navigate('/');
    window.location.href = redirectDestination;
  }, [dispatch, navigate, redirectDestination]);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component funcs                                              //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component hooks                                                 //
  /////////////////////////////////////////////////////////////////////////////

  // Initialize dependency values.
  React.useEffect(() => {
    if (redirectDestination || redirectFavicon || redirectName) {
      if (redirectDestination) cachedDestination.current = redirectDestination;
      if (redirectFavicon) cachedFavicon.current = redirectFavicon;
      if (redirectName) cachedName.current = redirectName;
      dispatch(slice.setIsVisible(true));
      return;
    }
    setTimeout(() => {
      dispatch(slice.setIsVisible(false));
    }, cssTimeToMilliseconds(variables.redirectPopupTransitionDurationFadeOut));
  }, [dispatch, redirectFavicon, redirectName, redirectDestination]);

  // Reset values on visibility change.
  React.useEffect(() => {
    if (isVisible) {
      dispatch(slice.setIsCopyable(true));
      setRemainingSeconds(RedirectPopupConfig.COUNTDOWN_SECONDS);
    }
  }, [dispatch, isVisible]);

  // Start countdown timer when popup is open.
  React.useEffect(() => {
    if (!RedirectPopupConfig.COUNTDOWN_ENABLED) return;

    const interval = setInterval(() => {
      if (!redirectDestination) {
        clearInterval(interval);
        return;
      }
      setRemainingSeconds((prev) => {
        if (prev !== 1) return prev - 1;
        startRedirect();
        clearInterval(interval);
        return 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, redirectDestination, startRedirect]);

  // Hook the click event to determine when a click is registered outside of the window.
  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!isVisible || !popupRef.current || popupRef.current.contains(e.target)) return;
      else closePopup(undefined);
    };
    const handleEnterEscKeys = (e) => {
      if (e.key === 'Enter' && isVisible) {
        startRedirect();
      }
      if (e.key === 'Escape' && isVisible) {
        closePopup(undefined);
      }
    };

    document.addEventListener('click', handleOutsideClick, false);
    document.addEventListener('keyup', handleEnterEscKeys, false);
    return () => {
      document.removeEventListener('click', handleOutsideClick, false);
      document.removeEventListener('keydown', handleEnterEscKeys, false);
    };
  }, [closePopup, isVisible, redirectDestination, startRedirect]);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component hooks                                              //
  /////////////////////////////////////////////////////////////////////////////

  return (
    <RemoveScroll enabled={isRedirecting || isVisible}>
      <div
        className={classNames(
          styles['fixed-wrapper'],
          styles[redirectDestination || redirectFavicon || redirectName ? 'visible' : 'invisible'],
        )}
      >
        <div
          className={classNames(
            styles['window-wrapper'],
            styles[redirectDestination || redirectFavicon || redirectName ? 'visible' : 'invisible'],
          )}
          ref={popupRef}
        >
          <div className={styles['window-title']}>
            <div />
            <div onMouseUp={closePopup} />
          </div>
          <div className={styles['window-body']}>
            <div className={styles['window-body-header']}>
              <img src={cachedFavicon.current} alt="favicon" />
              {`You're being redirected to ${cachedName.current} in ${RedirectPopupConfig.COUNTDOWN_ENABLED ? remainingSeconds : '♾️'} ${pluralizeString('second', remainingSeconds)}...`}
            </div>
            <div className={styles['window-body-row']}>
              <a href={cachedDestination.current} onMouseUp={closePopup} rel="noopener noreferrer" target="_blank">
                {cachedDestination.current}
              </a>
            </div>
            <div className={styles['window-body-row']}>
              <button
                className={classNames(styles[isCopyable ? 'enabled' : 'disabled'])}
                onMouseUp={() => (isCopyable ? copyUrl() : null)}
              >
                <img src={LinkEmoji} alt="link emoji" /> {isCopyable ? 'Copy URL' : 'Copied!'}
              </button>
            </div>
            <div className={styles['window-body-row']}>
              <div>
                {'Thanks for visiting! Press '}
                <span className={styles['go-back-span']}>Cancel</span>
                {' to return to my home page. '}
                <img src={HomeEmoji} alt="waving emoji" />
              </div>
            </div>
            <div className={styles['button-row']}>
              <button onMouseUp={startRedirect}>Proceed</button>
              <button onMouseUp={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </RemoveScroll>
  );
};

export default RedirectPopup;
