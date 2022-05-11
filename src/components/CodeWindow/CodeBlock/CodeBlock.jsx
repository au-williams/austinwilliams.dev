import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import variables from '../CodeWindow.module.scss';
import styles from './CodeBlock.module.scss';

const CodeBlock = ({ blockType, currentSize, isActiveBlock, isColoredBlock }) => {
  const [isPressed, setIsPressed] = useState(false);

  const classes = classNames(
    blockType,
    { [styles.pressed]: isPressed },
    { [styles.active]: isActiveBlock },
    { [styles.color]: isColoredBlock }
  );

  // calculate the width to perfectly align blocks across separate lines
  const calculatedWidth = `${variables.codeBlockSize} * ${currentSize}`;
  const calculatedSpace = `${variables.codeLineSpace} * ${currentSize * 2 - 2}`;
  const style = currentSize > 1 ? { width: `calc(${calculatedWidth} + ${calculatedSpace})` } : null;

  const onAnimationEnd = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    setIsPressed(true);
  }, [currentSize]);

  return <div className={classes} style={style} onAnimationEnd={onAnimationEnd} />;
};

CodeBlock.propTypes = {
  blockType: PropTypes.string.isRequired,
  currentSize: PropTypes.number.isRequired,
  isActiveBlock: PropTypes.bool.isRequired,
  isColoredBlock: PropTypes.bool.isRequired
};

export default CodeBlock;
