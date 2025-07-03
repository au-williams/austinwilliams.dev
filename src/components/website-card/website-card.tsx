import React from 'react';
import styles from './website-card.module.scss';

const WebsiteCard = ({ href, imgSrc, content }: { href: string; imgSrc: string; content: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={styles['website']}>
    <img src={imgSrc} alt="Website" />
    <div className={styles['overlay']}></div>
    <div className={styles['label']}>{content}</div>
  </a>
);

export default WebsiteCard;