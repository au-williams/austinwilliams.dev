import { type AppDispatch, type RootState } from '@/redux';
import { useSelector, useDispatch } from 'react-redux';
import * as slice from '@/redux/code-block-slice';
import classNames from 'classnames';
import React from 'react';
import styles from './code-block.module.scss';
import variables from '@/styles/_variables.module.scss';

/**
 * The CodeBlock component. One CodeLine component can have none to many nested CodeBlock components.
 * @param {string} param.blockId The unique identifier of the code block model used as the React key.
 * @param {string} param.blockType The code block type (name value defined in code-block.module.scss)
 * @param {number} param.currentSize The current code block size
 * @param {boolean} param.isActiveBlock If this is the current code block being displayed
 * @param {boolean} param.isColoredBlock If this code block is displayed in color
 * @returns {React.JSX.Element}
 */
const CodeBlock = ({
  blockId,
  blockType,
  currentSize,
  isActiveBlock,
  isColoredBlock,
}: {
  blockId: string;
  blockType: string;
  currentSize: number;
  isActiveBlock: boolean;
  isColoredBlock: boolean;
}): React.JSX.Element => {
  // Load the state from Redux.
  const dispatch = useDispatch<AppDispatch>();
  const isPushed = useSelector((state: RootState) => state.codeBlock[blockId]?.isPushed ?? false);

  // Create the CSS classes based on the component state.
  const classes = classNames(
    blockType,
    { [styles['active']]: isActiveBlock },
    { [styles['color']]: isColoredBlock },
    { [styles['pushed']]: isPushed },
  );

  // Set the style used to render the component.
  let style: React.CSSProperties | undefined;

  if (currentSize > 1) {
    // calculate the width to perfectly align blocks across separate lines
    const calculatedWidth = `${variables.codeBlockSize} * ${currentSize}`;
    const calculatedSpace = `${variables.codeLineSpace} * ${currentSize * 2 - 2}`;
    style = { width: `calc(${calculatedWidth} + ${calculatedSpace})` };
  }

  const onAnimationEnd = () => {
    dispatch(slice.setIsPushed(blockId, false));
  };

  // Animate the code block component each time its current size value changes.
  React.useEffect(() => {
    dispatch(slice.setIsPushed(blockId, true));
  }, [blockId, currentSize, dispatch]);

  return <div className={classes} onAnimationEnd={onAnimationEnd} style={style} />;
};

export default CodeBlock;
