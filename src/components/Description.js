import "./Description.css";
import Avatar from "../assets/avatar.jpg"
import Banner from "../assets/banner.png"
import GitHub from "../assets/github.svg"
import Scroll from "../assets/scroll.svg"

export default function Description(props) {
  const { asRef } = props;

  return (
    <main id='description' ref={asRef}>
      <article>
        <img src={Avatar} alt="avatar" draggable='false' />
        <span>Hey 👋 — My name is <a href='https://www.linkedin.com/in/auwilliams'>Austin</a>. I started my career by developing government programs and collaborating directly with big tech companies who taught me the art of delivering great software from start to finish.</span>
      </article>
      <article>
        <img src={Banner} alt="banner" draggable='false' />
        <span>I love working with computers and I'm always open to new opportunities. Feel free to send an email for side-work or employment inquiries. You can reach me anytime at <a href="mailto:me@austinwilliams.dev">me@austinwilliams.dev</a>. 📬</span>
      </article>
      <footer>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={Scroll} alt="return icon"/>
          Back to top
        </button>
        <a href='https://github.com/au-williams/au-williams.github.io' target="_blank" rel="noopener noreferrer">
          <img src={GitHub} alt="github logo"/>
          GitHub
        </a>
      </footer>
    </main>
  );
}
