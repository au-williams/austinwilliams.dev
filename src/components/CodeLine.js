import "./CodeLine.css";
import classNames from 'classnames';
import CodeBlock from "./CodeBlock";
import React, { useState } from "react";

const CodeLine = ({ codeBlocks }) => {
  const [ isClicked, setIsClicked ] = useState(false);
  const [ isHovered, setIsHovered ] = useState(false);

  return (
    <div
      className="code-line"
      onClick={() => setIsClicked(!isClicked)}
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}>
      {
        codeBlocks.some(codeBlock => codeBlock.isVisible) &&
          <div className={classNames(
            "line-number",
            {"clicked": isClicked},
            {"hovered": isHovered && !isClicked}
          )}/>
      }
      {
        codeBlocks.map((codeBlock, key) => 
          <CodeBlock
            key = {key}
            blockType = {codeBlock.blockType}
            currentSize = {codeBlock.currentSize}
            isColored = {isClicked || isHovered}
            isVisible = {codeBlock.isVisible}
          />
        )
      }
    </div>
  );
};

export default CodeLine;
