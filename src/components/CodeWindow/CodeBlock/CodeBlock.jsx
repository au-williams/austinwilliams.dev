import React from 'react';
import classNames from 'classnames';
import styles from './CodeBlock.module.scss';

const CodeBlock = ({ blockType, currentSize, useColor }) => (
  <div
    className={classNames(
      styles[blockType],
      { [styles.color]: useColor },
      { [styles[`size-${currentSize}`]]: currentSize > 1 }
    )}
  />
);

export default CodeBlock;
