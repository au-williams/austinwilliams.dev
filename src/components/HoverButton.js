import "./HoverButton.css";

export default function HoverButton(props) {
  const { toRef } = props;

  return (
    <button id='hover-button' onClick={() => toRef.current.scrollIntoView({ behavior: 'smooth' })}>
      <div>About</div>
      <div>&darr;</div>
    </button>
  );
}
