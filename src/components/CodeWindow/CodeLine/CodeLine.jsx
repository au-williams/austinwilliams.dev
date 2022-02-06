import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import styles from './CodeLine.module.scss';

const CodeLine = ({ codeBlocks, isClicked, isCurrentLine, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const lastVisibleIndex = isCurrentLine && codeBlocks.map((x) => x.isVisible).lastIndexOf(true);

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
      {codeBlocks.map(({ blockType, currentSize, key }, index) => (
        <CodeBlock
          key={key}
          blockType={blockType}
          currentSize={currentSize}
          isCurrentBlock={index === lastVisibleIndex}
          useColor={isClicked || isHovered}
        />
      ))}
    </div>
  );
};

CodeLine.propTypes = {
  codeBlocks: PropTypes.arrayOf(
    PropTypes.shape({
      blockType: PropTypes.string.isRequired,
      currentSize: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired
    })
  ).isRequired,
  isClicked: PropTypes.bool.isRequired,
  isCurrentLine: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default CodeLine;
