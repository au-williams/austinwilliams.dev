import classNames from 'classnames';
import React, { useState } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import styles from './CodeLine.module.scss';

function CodeLine({ codeBlocks, isClicked, onClick }) {
  const [ isHovered, setIsHovered ] = useState(false);

  return (
    <div
      className={styles.codeLine}
      onClick={() => onClick(!isClicked)}
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
    >
      {codeBlocks.length > 0 && <div className={classNames(
        styles.lineNumber,
        {[styles.clicked]: isClicked},
        {[styles.hovered]: isHovered && !isClicked}
      )}/>}
      {codeBlocks.map(({ blockType, currentSize }, key) =>
        <CodeBlock
          key = {key}
          blockType = {blockType}
          currentSize = {currentSize}
          useColor = {isClicked || isHovered}
        />
      )}
    </div>
  );
}

export default CodeLine;
