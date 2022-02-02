import React from 'react';
import styles from './CodeBlock.module.scss';
import classNames from 'classnames';

const CodeBlock = ({ blockType, currentSize, useColor }) => {
  return (
    <div className={classNames(
      styles[blockType],
      {[styles.color]: useColor},
      {[styles[`size-${currentSize}`]]: currentSize > 1}
    )}/>
  );
};

export default CodeBlock;
