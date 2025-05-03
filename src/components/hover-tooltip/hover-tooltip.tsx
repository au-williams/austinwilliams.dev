import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './hover-tooltip.module.scss';
import classNames from 'classnames';

const HoverTooltip = ({ img, text, children }: { img: string; text: string; children?: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const tooltipClasses = classNames(styles.tooltip, { [styles.hidden]: !isHovered });

  return (
    <div className={styles.wrapper} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
      <div className={tooltipClasses}>
        <img src={img} alt="" />
        <span>{text}</span>
      </div>
      {children}
    </div>
  );
};

HoverTooltip.propTypes = {
  img: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default HoverTooltip;
