import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import styles from './CodeLine.module.scss';

const CodeLine = ({ codeBlocks, isClicked, isCurrentLine, onClick }) => {
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
      <div
        className={classNames(
          styles.lineNumber,
          { [styles.clicked]: isClicked },
          { [styles.hovered]: isHovered && !isClicked }
        )}
      />
      {codeBlocks.map(({ blockType, currentSize }, index) => {
        const isCurrentBlock =
          isCurrentLine && codeBlocks.map((x) => x.isVisible).lastIndexOf(true) === index;

        return (
          <CodeBlock
            blockType={blockType}
            currentSize={currentSize}
            isCurrentBlock={isCurrentBlock}
            useColor={isClicked || isHovered}
          />
        );
      })}
    </div>
  );
};

CodeLine.propTypes = {
  codeBlocks: PropTypes.arrayOf(
    PropTypes.shape({
      blockType: PropTypes.string.isRequired,
      currentSize: PropTypes.number.isRequired
    })
  ).isRequired,
  isClicked: PropTypes.bool.isRequired,
  isCurrentLine: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default CodeLine;
