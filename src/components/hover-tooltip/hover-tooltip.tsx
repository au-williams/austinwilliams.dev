import { setIsHovering } from '../../redux/hover-tooltip-slice';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './hover-tooltip.module.scss';
import type { RootState, AppDispatch } from '../../redux';

const HoverTooltip = ({
  hoverTooltipId,
  img,
  text,
  children,
}: {
  hoverTooltipId: string;
  img: string;
  text: string;
  children?: React.ReactNode;
}) => {
  // Load the state from Redux.
  const dispatch = useDispatch<AppDispatch>();
  const isHovering = useSelector((state: RootState) => state.hoverTooltip[hoverTooltipId]?.isHovering ?? false);
  const tooltipClasses = classNames(styles.tooltip, { [styles.hidden]: !isHovering });

  return (
    <div
      className={styles.wrapper}
      onBlur={() => dispatch(setIsHovering(hoverTooltipId, false))}
      onFocus={() => dispatch(setIsHovering(hoverTooltipId, true))}
      onMouseOut={() => dispatch(setIsHovering(hoverTooltipId, false))}
      onMouseOver={() => dispatch(setIsHovering(hoverTooltipId, true))}
    >
      <div className={tooltipClasses}>
        <img src={img} alt={`${text} favicon`} />
        <span>{text}</span>
      </div>
      {children}
    </div>
  );
};

HoverTooltip.propTypes = {
  hoverTooltipId: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default HoverTooltip;
