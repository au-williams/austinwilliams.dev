import "./ScrollButton.css";
import React from 'react';

function ScrollButton(props) {
  const { toRef } = props;

  // todo: button animations
  // const [isHovering, setIsHovering] = useState(false);

  return (
    <button id='scroll-button' onClick={() => toRef.current.scrollIntoView({ behavior: 'smooth' })}>
      <div>About</div>
      <div>&darr;</div>
    </button>
  );
}

export default ScrollButton;
