import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import variables from '../CodeWindow.module.scss';
import styles from './CodeBlock.module.scss';

const CodeBlock = ({ blockType, currentSize, isActiveBlock, isColoredBlock }) => {
  const classes = classNames(
    blockType,
    { [styles.active]: isActiveBlock },
    { [styles.color]: isColoredBlock }
  );

  // calculate the width to perfectly align blocks across separate lines
  const calculatedWidth = `${variables.codeBlockSize} * ${currentSize}`;
  const calculatedSpace = `${variables.codeLineSpace} * ${currentSize * 2 - 2}`;
  const style = currentSize > 1 ? { width: `calc(${calculatedWidth} + ${calculatedSpace})` } : null;

  return <div className={classes} style={style} />;
};

CodeBlock.propTypes = {
  blockType: PropTypes.string.isRequired,
  currentSize: PropTypes.number.isRequired,
  isActiveBlock: PropTypes.bool.isRequired,
  isColoredBlock: PropTypes.bool.isRequired
};

export default CodeBlock;
