import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron-down-solid.svg';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './about-me-button.module.scss';
import variables from '../../styles/_variables.module.scss';
import type { RootState } from '../../stores';

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

  const isCodeWindowLoaded = useSelector((state: RootState) => state.codeWindow.isCodeWindowLoaded);

  const classes: string = classNames(
    styles.about,
    { [styles.hidden]: !isCodeWindowLoaded },
  );

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
      setArrowOpacity(computedOpacity);

      let computedTransform = "0";
      if (toggle || isHovering) computedTransform = styles.aboutButtonArrowTransitionDistance;
      setArrowTransform(`translateY(${computedTransform})`);

      toggle = !toggle;
    };

    computeStyle();
    setIntervalId(setInterval(computeStyle, delay));
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
      <div>
        About me
      </div>
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
