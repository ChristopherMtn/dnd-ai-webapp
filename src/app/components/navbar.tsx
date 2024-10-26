"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession(); // Access the session

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
          {!session ? (
            <button onClick={() => signIn("google")}>
              Sign in with Google
            </button>
          ) : (
            <div>
              <span style={{ color: "white", marginRight: "10px" }}>
                {session.user?.email}
              </span>
              <button onClick={() => signOut()} style={signOutButtonStyle}>
                Sign Out
              </button>
            </div>
          )}
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

const signOutButtonStyle = {
  backgroundColor: "#dc3545", // Red color for sign out
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};
