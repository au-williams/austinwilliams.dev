import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './CodeBlock.module.scss';

const CodeBlock = ({ blockType, currentSize, isCurrentBlock, useColor }) => (
  <div
    className={classNames(
      blockType,
      { [styles.press]: isCurrentBlock },
      { [styles.color]: useColor },
      { [styles[`size-${currentSize}`]]: currentSize > 1 }
    )}
  />
);

CodeBlock.propTypes = {
  blockType: PropTypes.string.isRequired,
  currentSize: PropTypes.number.isRequired,
  isCurrentBlock: PropTypes.bool.isRequired,
  useColor: PropTypes.bool.isRequired
};

export default CodeBlock;
