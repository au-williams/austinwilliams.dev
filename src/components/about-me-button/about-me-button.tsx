import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron-down-solid.svg';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './about-me-button.module.scss';
import variables from '../../styles/_variables.module.scss';

/**
 * @returns {React.JSX.Element}
 */
const AboutMeButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}): React.JSX.Element => {
  const [arrowOpacity, setArrowOpacity] = useState(styles.aboutButtonArrowOpacityMinimum);
  const [arrowTransform, setArrowTransform] = useState('translateY(0)');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const visibleDelay = variables.aboutButtonInitializeSpeed.endsWith('ms')
    ? parseFloat(variables.aboutButtonInitializeSpeed)
    : parseFloat(variables.aboutButtonInitializeSpeed) * 1000;

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), visibleDelay);
    return () => clearTimeout(timeout)
  }, [isVisible])

  const classes: string = classNames(
    styles.about,
    { [styles.hidden]: !isVisible },
  );

  useEffect(() => {
    let toggle = false;

    if (intervalId) {
      clearInterval(intervalId);
    }

    const arrowDelay = variables.aboutButtonArrowTransitionSpeed.endsWith('ms')
      ? parseFloat(variables.aboutButtonArrowTransitionSpeed)
      : parseFloat(variables.aboutButtonArrowTransitionSpeed) * 1000;

    const computeStyle = () => {
      let computedOpacity = styles.aboutButtonArrowOpacityMinimum;
      if (toggle || isHovering) computedOpacity = "1";
      setArrowOpacity(computedOpacity);

      let computedTransform = "0";
      if (toggle || isHovering) computedTransform = styles.aboutButtonArrowTransitionDistance;
      setArrowTransform(`translateY(${computedTransform})`);

      toggle = !toggle;
    };

    computeStyle();
    setIntervalId(setInterval(computeStyle, arrowDelay));
    return () => clearInterval(intervalId);
  }, [isHovering]);

  return (
    <button
      className={classes}
      type="button"
      onClick={onClick}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      About me
      <br/>
      <ChevronIcon style={{
        opacity: arrowOpacity,
        transform: arrowTransform
      }} />
    </button>
  );
};

AboutMeButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default AboutMeButton;
