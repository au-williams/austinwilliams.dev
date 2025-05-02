import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CodeBlock from '../code-block/code-block';
import styles from './code-line.module.scss';

const CodeLine = ({ codeBlocks, isActiveLine, isClicked, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const lineNumberClasses = classNames(
    styles.lineNumber,
    { [styles.clicked]: isClicked },
    { [styles.hovered]: isHovered && !isClicked },
  );

  return (
    <div
      className={styles.codeLine}
      onClick={() => onClick(!isClicked)}
      onFocus={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
      role="presentation"
    >
      <div className={lineNumberClasses} />
      {codeBlocks.map(({ blockType, currentSize, key }, index) => {
        const isLastBlock = index === codeBlocks.length - 1;
        const isActiveBlock = isActiveLine && isLastBlock;
        const isColoredBlock = isClicked || isHovered;

        return (
          <CodeBlock
            key={key}
            blockType={blockType}
            currentSize={currentSize}
            isActiveBlock={isActiveBlock}
            isColoredBlock={isColoredBlock}
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
      currentSize: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isActiveLine: PropTypes.bool.isRequired,
  isClicked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CodeLine;
