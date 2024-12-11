"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreferred = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(darkModePreferred);
  }, []);

  return (
    <nav className={`${styles.nav} ${isDarkMode ? styles.dark : styles.light}`}>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.li}>
          <Link href="/magic-item-generator">Magic Item Generator</Link>
        </li>
        <li className={styles.li}>
          <Link href="/trap-generator">Trap Generator</Link>
        </li>
        <li className={styles.li}>
          <Link href="/npc-generator">NPC Generator</Link>
        </li>
      </ul>
    </nav>
  );
}
