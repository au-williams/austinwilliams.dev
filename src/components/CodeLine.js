import "./CodeLine.css";
import classNames from 'classnames';
import CodeBlock from "./CodeBlock";
import React, { useState } from "react";
import { v4 as uuid } from 'uuid';

export default function CodeLine(props) {
  const { codeBlocks, isActive } = props;
  const [ isClicked, setIsClicked ] = useState(false);
  const [ isHovered, setIsHovered ] = useState(false);

  const lineNumberClasses = classNames(
    "line-number",
    {["clicked"]: isClicked},
    {["hovered"]: isHovered && !isClicked}
  );

  return (
    <div
      className="code-line"
      onClick={() => setIsClicked(!isClicked)}
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}>
      {
        // display line number if any line content is visible
        codeBlocks.some(codeBlock => codeBlock.isVisible) &&
          <div className={lineNumberClasses}></div>
      }
      {codeBlocks.map(codeBlock => 
        <CodeBlock
          key = {uuid()}
          blockType = {codeBlock.blockType}
          currentSize = {codeBlock.currentSize}
          isVisible = {codeBlock.isVisible}
          isClicked = {isClicked}
          isHovered = {isHovered}
        />
      )}
    </div>
  );
}
