import "./CodeBlock.css";
import React from "react";
import classNames from 'classnames';

export default function CodeBlock(props) {
  const {
    blockType,
    currentSize,
    isActive,
    isClicked,
    isHovered,
    isVisible,
  } = props;

  const canUseCurrentSize = currentSize > 1;
  const codeBlockClasses = classNames(
    {[blockType]: isVisible},
    {"clicked": isVisible && isClicked},
    {"hovered": (isVisible && isHovered && !isClicked) || isActive},
    {[`size-${currentSize}`]: isVisible && canUseCurrentSize}
  )

  return (
    <div
      // key={uuid()}
      className={codeBlockClasses}
    />
  );
}
