// MenuBar.jsx
import React, { useState } from 'react';
import styles from './MenuBar.module.css';

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.menuBar}>
      <div className={styles.logo}>TikTokWrapped</div>
      <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul className={`${styles.menuItems} ${isOpen ? styles.menuOpen : ''}`}>
      
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/blog">FQA</a></li>
        
      </ul>
    </nav>
  );
}

export default MenuBar;
