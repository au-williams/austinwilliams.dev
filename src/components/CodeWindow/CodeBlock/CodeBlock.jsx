import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import variables from '../CodeWindow.module.scss';
import styles from './CodeBlock.module.scss';

const CodeBlock = ({ blockType, currentSize, isActiveBlock, isColoredBlock }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  const classes = classNames(
    blockType,
    { [styles.active]: isActiveBlock },
    { [styles.animated]: isAnimated },
    { [styles.color]: isColoredBlock }
  );

  // calculate the width to perfectly align blocks across separate lines
  const calculatedWidth = `${variables.codeBlockSize} * ${currentSize}`;
  const calculatedSpace = `${variables.codeLineSpace} * ${currentSize * 2 - 2}`;
  const style = currentSize > 1 ? { width: `calc(${calculatedWidth} + ${calculatedSpace})` } : null;

  useEffect(() => {
    setIsAnimated(true);
  }, [currentSize]);

  return <div className={classes} style={style} onAnimationEnd={() => setIsAnimated(false)} />;
};

CodeBlock.propTypes = {
  blockType: PropTypes.string.isRequired,
  currentSize: PropTypes.number.isRequired,
  isActiveBlock: PropTypes.bool.isRequired,
  isColoredBlock: PropTypes.bool.isRequired
};

export default CodeBlock;
