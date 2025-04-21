import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './code-block.module.scss';
import variables from '../code-window/code-window.module.scss';

/**
 * The CodeBlock component. A single CodeLine component can have none to many nested CodeBlock components.
 * @param {string} param.blockType The code block type (name value defined in code-block.module.scss)
 * @param {number} param.currentSize The current code block size
 * @param {boolean} param.isActiveBlock If this is the current code block being displayed
 * @param {boolean} param.isColoredBlock If this code block is displayed in color
 * @returns {React.JSX.Element}
 */
const CodeBlock = ({
  blockType,
  currentSize,
  isActiveBlock,
  isColoredBlock,
}: {
  blockType: string;
  currentSize: number;
  isActiveBlock: boolean;
  isColoredBlock: boolean;
}): React.JSX.Element => {
  const [isPushed, setIsPushed] = useState(false);

  // Animate the code block component each time its current size value changes.
  useEffect(() => {
    setIsPushed(true);
  }, [currentSize]);

  // Unbind when the animation ends so the animation can be replayed as needed.
  const onAnimationEnd = () => setIsPushed(false);

  // Create the CSS classes based on the component state.
  const classes = classNames(
    blockType,
    { [styles.active]: isActiveBlock },
    { [styles.color]: isColoredBlock },
    { [styles.pushed]: isPushed },
  );

  // calculate the width to perfectly align blocks across separate lines
  const calculatedWidth = `${variables.codeBlockSize} * ${currentSize}`;
  const calculatedSpace = `${variables.codeLineSpace} * ${currentSize * 2 - 2}`;

  let style: React.CSSProperties | undefined;
  if (currentSize > 1) style = { width: `calc(${calculatedWidth} + ${calculatedSpace})` };

  return <div className={classes} style={style} onAnimationEnd={onAnimationEnd} />;
};

CodeBlock.propTypes = {
  blockType: PropTypes.string.isRequired,
  currentSize: PropTypes.number.isRequired,
  isActiveBlock: PropTypes.bool.isRequired,
  isColoredBlock: PropTypes.bool.isRequired,
};

export default CodeBlock;
