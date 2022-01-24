import React from 'react';
import './CodeBlock.css';
import classNames from 'classnames';

const CodeBlock = ({ blockType, currentSize, useColor }) => {
  return (
    <div className={classNames(
      [blockType],
      {'color': useColor},
      {[`size-${currentSize}`]: currentSize > 1}
    )}/>
  );
};

export default CodeBlock;
