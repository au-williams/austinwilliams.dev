import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styles from './about-me-button.module.scss';
import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron-down-solid.svg';
import variables from '../../styles/_variables.module.scss';

/**
 * @returns {React.JSX.Element}
 */
const AboutMeButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}): React.JSX.Element => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [isHovering, setIsHovering] = useState(false);
  const [opacity, setOpacity] = useState(styles.aboutButtonArrowOpacityMinimum);
  const [transform, setTransform] = useState('translateY(0)');

  useEffect(() => {
    let toggle = false;

    if (intervalId) {
      clearInterval(intervalId);
    }

    const delay = variables.aboutButtonArrowTransitionSpeed.endsWith('ms')
      ? parseFloat(variables.aboutButtonArrowTransitionSpeed)
      : parseFloat(variables.aboutButtonArrowTransitionSpeed) * 1000;

    const computeStyle = () => {
      let computedOpacity = styles.aboutButtonArrowOpacityMinimum;
      if (toggle || isHovering) computedOpacity = "1";
      setOpacity(computedOpacity);

      let computedTransform = "0";
      if (toggle || isHovering) computedTransform = styles.aboutButtonArrowTransitionDistance;
      setTransform(`translateY(${computedTransform})`);

      toggle = !toggle;
    };

    computeStyle();
    setIntervalId(setInterval(computeStyle, delay));
    return () => clearInterval(intervalId);
  }, [isHovering]);

  return (
    <button
      className={styles.about}
      type="button"
      onClick={onClick}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      About me
      <br />
      <ChevronIcon style={{ opacity, transform }} />
    </button>
  );
};

AboutMeButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default AboutMeButton;
