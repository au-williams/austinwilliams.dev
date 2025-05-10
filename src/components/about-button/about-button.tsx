import { cssTimeToMilliseconds } from '../../utilities';
import { GA4 } from 'react-ga4/types/ga4';
import { setAboutButtonArrowDuration, setAboutButtonArrowOpacity, setAboutButtonArrowTransform, setAboutButtonIntervalId, setAboutButtonIsHidden, setAboutButtonIsHovering } from '../../redux/about-button-slice';
import { type RootState, type AppDispatch } from '../../redux';
import { useSelector, useDispatch } from 'react-redux';
import ChevronIcon from '../../assets/icons/chevron-down-solid.svg?react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './about-button.module.scss';
import variables from '../../styles/_variables.module.scss';

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
  sectionRef: React.MutableRefObject<HTMLDivElement | null>;
}): React.JSX.Element => {
  // Load the state from Redux.
  const dispatch = useDispatch<AppDispatch>();
  const arrowDuration = useSelector((state: RootState) => state.aboutButton.arrowDuration);
  const arrowOpacity = useSelector((state: RootState) => state.aboutButton.arrowOpacity);
  const arrowTransform = useSelector((state: RootState) => state.aboutButton.arrowTransform);
  const intervalId = useSelector((state: RootState) => state.aboutButton.intervalId);
  const isHidden = useSelector((state: RootState) => state.aboutButton.isHidden);
  const isHovering = useSelector((state: RootState) => state.aboutButton.isHovered);

  // On component load set a timeout before making it visible.
  React.useEffect(() => {
    const delay: number = cssTimeToMilliseconds(variables.aboutButtonTransitionDelayInitialize);
    const timeout = setTimeout(() => dispatch(setAboutButtonIsHidden(false)), delay);
    return () => clearTimeout(timeout);
  }, []);

  // On hover update the CSS properties of the arrow SVG.
  React.useEffect(() => {
    let toggle = false;

    if (intervalId) {
      clearInterval(intervalId);
    }

    const computeStyle = () => {
      let computedDuration = variables.aboutButtonArrowTransitionDuration;
      if (isHovering) computedDuration = variables.aboutButtonArrowTransitionDurationHover;
      dispatch(setAboutButtonArrowDuration(computedDuration));

      let computedOpacity = styles.aboutButtonArrowOpacityMinimum;
      if (toggle || isHovering) computedOpacity = '1';
      dispatch(setAboutButtonArrowOpacity(computedOpacity));

      let computedTransform = '0';
      if (toggle || isHovering) computedTransform = styles.aboutButtonArrowTransitionDistance;
      dispatch(setAboutButtonArrowTransform(`translateY(${computedTransform})`));

      toggle = !toggle;
    };

    computeStyle();

    const delay = cssTimeToMilliseconds(variables.aboutButtonArrowTransitionDuration);
    dispatch(setAboutButtonIntervalId(setInterval(computeStyle, delay)));
    return () => clearInterval(intervalId);
  }, [isHovering]);

  /**
   * Sends a Google Analytics event when the about button's clicked and scrolls
   * the web client down beyond the landing and to the start of the sectionRef.
   */
  const onAboutButtonClick = () => {
    sectionRef.current!.scrollIntoView({ behavior: 'smooth' });
    reactGA.event({ category: 'click', action: 'about_button' });
  };

  return (
    <button
      className={classNames(styles.aboutButton, { [styles.hidden]: isHidden })}
      onClick={onAboutButtonClick}
      onMouseOut={() => dispatch(setAboutButtonIsHovering(false))}
      onMouseOver={() => dispatch(setAboutButtonIsHovering(true))}
      type="button"
    >
      About me
      <br />
      <ChevronIcon
        style={{
          opacity: arrowOpacity,
          transform: arrowTransform,
          transitionDuration: arrowDuration,
        }}
      />
    </button>
  );
};

AboutButton.propTypes = {
  reactGA: PropTypes.object.isRequired,
  sectionRef: PropTypes.object.isRequired,
};

export default AboutButton;
