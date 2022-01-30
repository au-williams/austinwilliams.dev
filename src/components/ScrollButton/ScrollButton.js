import "./ScrollButton.css";
import React, { useState } from 'react';

function ScrollButton(props) {
  const { toRef } = props;

  const [isMouseHovering, setIsMouseHovering] = useState(false);
  const onMouseLeave = () => setIsMouseHovering(false);
  const onMouseOver = () => setIsMouseHovering(true);
  const className = isMouseHovering ? "hover" : null;

  return (
    <button
      id='scroll-button'
      onClick={() => toRef.current.scrollIntoView({ behavior: 'smooth' })}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseOver}
    >
      <div>About</div>
      <div className={className}>&darr;</div>
    </button>
  );
}

export default ScrollButton;
