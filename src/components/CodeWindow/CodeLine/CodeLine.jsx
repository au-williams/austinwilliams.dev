import classNames from 'classnames';
import React, { useState } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import styles from './CodeLine.module.scss';

const CodeLine = ({ codeBlocks, isClicked, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.codeLine}
      onClick={() => onClick(!isClicked)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      role="presentation"
    >
      {codeBlocks.length > 0 && (
        <div
          className={classNames(
            styles.lineNumber,
            { [styles.clicked]: isClicked },
            { [styles.hovered]: isHovered && !isClicked }
          )}
        />
      )}
      {codeBlocks.map(({ blockType, currentSize }) => (
        <CodeBlock
          blockType={blockType}
          currentSize={currentSize}
          useColor={isClicked || isHovered}
        />
      ))}
    </div>
  );
};

export default CodeLine;
