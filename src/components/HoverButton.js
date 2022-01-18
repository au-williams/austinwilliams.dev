import "./HoverButton.css";

export default function HoverButton(props) {
  const { toRef } = props;

  return (
    <button id='hover-button' onClick={() => toRef.current.scrollIntoView({ behavior: 'smooth' })}>
      <span>About</span>
      <span>&darr;</span>
    </button>
  );
}
