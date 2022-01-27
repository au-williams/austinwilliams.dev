import './Content.css';
import AvatarPlaceholder from '../assets/content/avatar_placeholder.svg';
import Banner from '../assets/content/banner.png';
import GitHub from '../assets/icon/github.svg';
import Mailbox from '../assets/emoji/mailbox.png';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import Scroll from '../assets/icon/scroll.svg'
import Wave from '../assets/emoji/wave.png';

export default function Description(props) {
  const { isRef } = props;
  const [avatar, setAvatar] = useState(AvatarPlaceholder);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const sendGaEvent = (category, action) => ReactGA.event({category, action});

  useEffect(() => {
    fetch('https://api.github.com/users/au-williams')
    .then(res => res.json())
    .then(result => setAvatar(result.avatar_url))
    .catch(error => console.error('Error:', error));
  });

  return (
    <div id='content-wrapper' ref={isRef}>
      <div className='flex-wrapper'>
        <img src={avatar} alt='avatar' draggable='false' />
        <div>Hey <img src={Wave} alt='waving emoji'/> — My name is <a href='https://www.linkedin.com/in/auwilliams'>Austin</a>. I started my career by developing government programs and collaborating with major tech companies, who taught me their art of delivering great software from start to finish.</div>
      </div>
      <div className='flex-wrapper'>
        <img src={Banner} alt='banner' draggable='false'/>
        <div>I love working with computers and I&apos;m always open to new opportunities. Feel free to send an email for side-work or employment inquiries — you can reach me at <a href='mailto:me@austinwilliams.dev'>me@austinwilliams.dev</a>. <img src={Mailbox} alt='mailbox emoji'/></div>
      </div>
      <div id='footer'>
        <button
          onClick={() => {
            sendGaEvent('click', 'back_to_top_button');
            scrollToTop();
          }}>
          <img src={Scroll} alt='return icon'/>
          Back to top
        </button>
        <a
          href='https://github.com/au-williams/au-williams.github.io'
          onClick={() => sendGaEvent('click', 'github_outbound_link')}
          rel='noopener noreferrer'
          target='_blank'
        >
          <img src={GitHub} alt='github'/>
          GitHub
        </a>
      </div>
    </div>
  );
}
