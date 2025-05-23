import { useSelector, useDispatch } from 'react-redux';
import * as slice from '@/redux/hover-tooltip-slice';
import classNames from 'classnames';
import React from 'react';
import styles from './hover-tooltip.module.scss';
import type { AppDispatch, RootState } from '@/redux';

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

  return (
    <div
      className={styles.wrapper}
      onBlur={() => dispatch(slice.setIsHovering(hoverTooltipId, false))}
      onFocus={() => dispatch(slice.setIsHovering(hoverTooltipId, true))}
      onMouseOut={() => dispatch(slice.setIsHovering(hoverTooltipId, false))}
      onMouseOver={() => dispatch(slice.setIsHovering(hoverTooltipId, true))}
    >
      <div className={classNames(styles.tooltip, { [styles.hidden]: !isHovering })}>
        <img src={img} alt={`${text} favicon`} />
        <span>{text}</span>
      </div>
      {children}
    </div>
  );
};

export default HoverTooltip;
