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
          <Link href="/magic-item-generator">Magic Items</Link>
        </li>
        <li className={styles.li}>
          <Link href="/trap-generator">Traps</Link>
        </li>
        <li className={styles.li}>
          <Link href="/npc-generator">NPCs</Link>
        </li>
      </ul>
    </nav>
  );
}
