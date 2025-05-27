import { cssTimeToMilliseconds } from '@/utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { type RootState } from '@/redux';
import { useDispatch, useSelector } from 'react-redux';
import * as slice from '@/redux/about-button-slice';
import ChevronIcon from '@/assets/icons/chevron-down-solid.svg?react';
import classNames from 'classnames';
import React from 'react';
import styles from './about-button.module.scss';
import variables from '@/styles/_variables.module.scss';

/**
 * The floating about button. Idle animation bobs up and down. Hovering readies
 * to the furthest animation position. Clicking scrolls the page downwards.
 * @returns {React.JSX.Element}
 */
const AboutButton = ({
  reactGA,
  sectionRef,
}: {
  reactGA: GA4;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element => {
  /////////////////////////////////////////////////////////////////////////////
  // #region props                                                           //
  /////////////////////////////////////////////////////////////////////////////

  // Load the state from Redux.
  const dispatch = useDispatch();
  const arrowStyle = useSelector((state: RootState) => state.aboutButton.arrowStyle);
  const isHovering = useSelector((state: RootState) => state.aboutButton.isHovering);
  const isInitialized = useSelector((state: RootState) => state.codeWindow.isInitialized);
  const isVisible = useSelector((state: RootState) => state.aboutButton.isVisible);

  const intervalRef = React.useRef<number | null>(null);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion props                                                        //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region funcs                                                           //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Sends a Google Analytics event when the about button's clicked and scrolls
   * the web client down beyond the landing and to the start of the sectionRef.
   */
  const onAboutButtonClick = () => {
    if (!sectionRef.current) return;
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    reactGA.event({ category: 'click', action: 'about_button' });
  };

  /////////////////////////////////////////////////////////////////////////////
  // #endregion funcs                                                        //
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // #region hooks                                                           //
  /////////////////////////////////////////////////////////////////////////////

  /**
   * On component load, await dependency initialization before making visible.
   */
  React.useEffect(() => {
    if (!isInitialized) return;
    dispatch(slice.setIsVisible(true));
  }, [dispatch, isInitialized]);

  /**
   * On component hover, update the CSS properties of the animated arrow SVG.
   */
  React.useEffect(() => {
    let toggle = false;

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    const computeArrowStyle = () => {
      let computedDuration = variables.aboutButtonArrowTransitionDuration;
      if (isHovering) computedDuration = variables.aboutButtonArrowTransitionDurationHover;

      let computedOpacity = styles.aboutButtonArrowOpacityMinimum;
      if (isHovering || toggle) computedOpacity = '1';

      let computedTransform = '0';
      if (isHovering || toggle) computedTransform = styles.aboutButtonArrowTransitionDistance;

      dispatch(
        slice.setArrowStyle({
          opacity: computedOpacity,
          transform: `translateY(${computedTransform})`,
          transitionDuration: computedDuration,
        }),
      );

      toggle = !toggle;
    };

    computeArrowStyle();
    const delay = cssTimeToMilliseconds(variables.aboutButtonArrowTransitionDuration);
    intervalRef.current = window.setInterval(computeArrowStyle, delay);

    return () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
    };
  }, [dispatch, isHovering]);

  /////////////////////////////////////////////////////////////////////////////
  // #endregion hooks                                                        //
  /////////////////////////////////////////////////////////////////////////////

  return (
    <button
      className={classNames(styles['about-button'], styles[isVisible ? 'visible' : 'hidden'])}
      onClick={onAboutButtonClick}
      onMouseOut={() => dispatch(slice.setIsHovering(false))}
      onMouseOver={() => dispatch(slice.setIsHovering(true))}
      type="button"
    >
      About me
      <br />
      <ChevronIcon style={arrowStyle} />
    </button>
  );
};

export default AboutButton;
