import classNames from 'classnames';
import React, { useState } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import './CodeLine.css';

function CodeLine({ codeBlocks, isClicked, onClick }) {
  const [ isHovered, setIsHovered ] = useState(false);

  return (
    <div
      className='code-line'
      onClick={() => onClick(!isClicked)}
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}>
      {
        codeBlocks.some(codeBlock => codeBlock.isVisible) &&
          <div className={classNames(
            'line-number',
            {'clicked': isClicked},
            {'hovered': isHovered && !isClicked}
          )}/>
      }
      {
        codeBlocks.map((codeBlock, key) => 
          codeBlock.isVisible && <CodeBlock
            key = {key}
            blockType = {codeBlock.blockType}
            currentSize = {codeBlock.currentSize}
            useColor = {isClicked || isHovered}
          />
        )
      }
    </div>
  );
}

export default CodeLine;
