import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './code-block.module.scss';
import variables from '../code-window/code-window.module.scss';

/**
 * Description placeholder
 *
 * @param {object} param0
 * @param {*} param0.blockType
 * @param {*} param0.currentSize
 * @param {*} param0.isActiveBlock
 * @param {*} param0.isColoredBlock
 * @returns
 */
const CodeBlock = ({
  blockType,
  currentSize,
  isActiveBlock,
  isColoredBlock,
}: {
  blockType: any;
  currentSize: any;
  isActiveBlock: any;
  isColoredBlock: any;
}) => {
  const [isPushed, setIsPushed] = useState(false);

  // animate code block every time it increments its size
  useEffect(() => {
    setIsPushed(true);
  }, [currentSize]);

  // unbind on animation end so it can be replayed
  const onAnimationEnd = () => setIsPushed(false);

  const classes = classNames(
    blockType,
    { [styles.active]: isActiveBlock },
    { [styles.color]: isColoredBlock },
    { [styles.pushed]: isPushed },
  );

  // calculate the width to perfectly align blocks across separate lines
  const calculatedWidth = `${variables.codeBlockSize} * ${currentSize}`;
  const calculatedSpace = `${variables.codeLineSpace} * ${currentSize * 2 - 2}`;
  const style =
    currentSize > 1
      ? { width: `calc(${calculatedWidth} + ${calculatedSpace})` }
      : undefined;

  return (
    <div className={classes} style={style} onAnimationEnd={onAnimationEnd} />
  );
};

CodeBlock.propTypes = {
  blockType: PropTypes.string.isRequired,
  currentSize: PropTypes.number.isRequired,
  isActiveBlock: PropTypes.bool.isRequired,
  isColoredBlock: PropTypes.bool.isRequired,
};

export default CodeBlock;
