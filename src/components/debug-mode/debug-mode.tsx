import { useDispatch, useSelector } from 'react-redux';
import { BugEmoji } from '@/assets/images';
import classNames from 'classnames';
import React, { useRef } from 'react';
import styles from './debug-mode.module.scss';
import HoverTooltip from '../hover-tooltip/hover-tooltip';

/**
 * The floating about button. Idle animation bobs up and down. Hovering readies
 * to the furthest animation position. Clicking scrolls the page downwards.
 * @returns {React.JSX.Element}
 */
const DebugMode = (): React.JSX.Element => {
  /////////////////////////////////////////////////////////////////////////////
  // #region Component props                                                 //
  /////////////////////////////////////////////////////////////////////////////

  const [isVisible, setIsVisible] = React.useState(false);
  // Load the state from Redux.
  const dispatch = useDispatch();

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component props                                              //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region Component hooks                                                 //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * On component load, await dependency initialization before making visible.
   */
  React.useEffect(() => {
    setIsVisible(true);
  }, [dispatch]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // e.key is "`" when Shift is NOT held, and "~" when Shift IS held
      if (e.key === '~' && e.shiftKey) setIsVisible(!isVisible);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion Component hooks                                              //
  /////////////////////////////////////////////////////////////////////////////

  return (
    <div className={styles['debug-mode-wrapper']}>
      <HoverTooltip hoverTooltipId={'dme'} img={""} text={'Debug mode enabled'}>
        <button
          className={classNames(styles['debug-mode-button'], styles[isVisible ? 'visible' : 'hidden'])}
          type="button"
        >
          <img src={BugEmoji} />
        </button>
      </HoverTooltip>
    </div>
  );
};

export default DebugMode;
