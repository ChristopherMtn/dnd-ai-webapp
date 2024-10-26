// app/AuthProvider.tsx
"use client"; // Make this a Client Component

import { SessionProvider } from "next-auth/react";
import Navbar from "../components/navbar"; // Adjust the path as necessary

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
