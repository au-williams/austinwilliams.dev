import { cssTimeToMilliseconds } from '../../utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron-down-solid.svg';
import { setAboutButtonArrowDuration, setAboutButtonArrowOpacity, setAboutButtonArrowTransform, setAboutButtonIntervalId, setAboutButtonIsHovering, setAboutButtonIsVisible } from '../../stores/about-button-slice';
import { type RootState, type AppDispatch, store } from '../../stores';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './about-button.module.scss';
import variables from '../../styles/_variables.module.scss';

/**
 * The floating about button. Idle animation bobs up and down. Hovering readies
 * to the furthest animation position. Clicking sends
 * @returns {React.JSX.Element}
 */
const AboutButton = ({
  reactGA,
  sectionRef
}: {
  reactGA: GA4,
  sectionRef: React.MutableRefObject<HTMLDivElement | null>
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  // Load the state from Redux.
  const arrowDuration = useSelector((state: RootState) => state.aboutButton.arrowDuration);
  const arrowOpacity = useSelector((state: RootState) => state.aboutButton.arrowOpacity);
  const arrowTransform = useSelector((state: RootState) => state.aboutButton.arrowTransform);
  const intervalId = useSelector((state: RootState) => state.aboutButton.intervalId);
  const isHovering = useSelector((state: RootState) => state.aboutButton.isHovered);
  const isVisible = useSelector((state: RootState) => state.aboutButton.isVisible);

  // Calculate the initialization duration from the scss value.
  const duration = variables.aboutButtonInitializeDuration.endsWith('ms')
    ? parseFloat(variables.aboutButtonInitializeDuration)
    : parseFloat(variables.aboutButtonInitializeDuration) * 1000;

  // On component load set a timeout before making visible.
  React.useEffect(() => {
    const timeout = setTimeout(() => dispatch(setAboutButtonIsVisible(true)), duration);
    return () => clearTimeout(timeout)
  }, [isVisible]);

  const classes: string = classNames(
    styles.about,
    { [styles.hidden]: !isVisible },
  );

  /**
   * Sends a Google Analytics event when the about button's clicked and scrolls
   * the web client down beyond the landing and to the start of the sectionRef.
   */
  const onClick = () => {
    reactGA.event({ category: 'click', action: 'about_button' });
    sectionRef.current!.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    let toggle = false;

    if (intervalId) {
      clearInterval(intervalId);
    }

    const computeStyle = () => {
      let computedDuration = variables.aboutButtonArrowTransitionDuration;
      if (isHovering) computedDuration = variables.aboutButtonArrowTransitionDurationHover;
      dispatch(setAboutButtonArrowDuration(computedDuration));

      let computedOpacity = styles.aboutButtonArrowOpacityMinimum;
      if (toggle || isHovering) computedOpacity = "1";
      dispatch(setAboutButtonArrowOpacity(computedOpacity));

      let computedTransform = "0";
      if (toggle || isHovering) computedTransform = styles.aboutButtonArrowTransitionDistance;
      dispatch(setAboutButtonArrowTransform(`translateY(${computedTransform})`));

      toggle = !toggle;
    };

    computeStyle();

    const delay = cssTimeToMilliseconds(variables.aboutButtonArrowTransitionDuration);
    dispatch(setAboutButtonIntervalId(setInterval(computeStyle, delay)));
    return () => clearInterval(intervalId);
  }, [isHovering]);

  return (
    <button
      className={classes}
      onClick={onClick}
      onMouseOut={() => dispatch(setAboutButtonIsHovering(false))}
      onMouseOver={() => dispatch(setAboutButtonIsHovering(true))}
      type="button"
    >
      About me
      <br/>
      <ChevronIcon style={{
        opacity: arrowOpacity,
        transform: arrowTransform,
        transitionDuration: arrowDuration
      }} />
    </button>
  );
};

AboutButton.propTypes = {
  reactGA: PropTypes.object.isRequired,
  sectionRef: PropTypes.object.isRequired
};

export default AboutButton;
