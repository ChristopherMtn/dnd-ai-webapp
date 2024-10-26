"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link href="/trap-generator">Trap Generator</Link>
        </li>
        <li style={liStyle}>
          <Link href="/magic-item-generator">Magic Item Generator</Link>
        </li>
        <li style={{ ...liStyle, marginLeft: "auto" }}>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </li>
      </ul>
    </nav>
  );
}

const navStyle = {
  padding: "10px",
  backgroundColor: "#333",
};

const ulStyle = {
  display: "flex",
  listStyleType: "none",
  margin: 0,
  padding: 0,
};

const liStyle = {
  marginRight: "15px",
};
