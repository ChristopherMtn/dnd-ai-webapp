"use client";

import Image from "next/image";
import Link from "next/link";
// import { useState, useEffect } from "react";

export default function HomePage() {
  // const [showScrollPrompt, setShowScrollPrompt] = useState(true);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 20) {
  //       setShowScrollPrompt(false);
  //     } else {
  //       setShowScrollPrompt(true);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <div
      style={{
        fontFamily: `'Inter', sans-serif`,
        backgroundColor: "#f4f4f4",
        color: "#333",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          flex: "1 0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            marginBottom: "1rem",
            letterSpacing: "1px",
          }}
        >
          Dungeons and Dragons AI
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "850px",
            margin: "0 auto",
            lineHeight: 1.5,
            color: "#666",
          }}
        >
          Harness the power of AI to instantly generate compelling NPCs,
          intricate traps, and mesmerizing magic items for your D&D campaigns.
        </p>
        {/* {showScrollPrompt && (
          <div style={{ marginTop: "3rem" }}>
            <button
              onClick={() => {
                const section = document.getElementById("generators-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                color: "#777",
              }}
            >
              ↓ Scroll Down
            </button>
          </div>
        )} */}
      </section>

      {/* Generators Section */}
      <section
        id="generators-section"
        style={{
          flex: "1 0 auto",
          padding: "4rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Choose Your Generator
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "1000px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Magic Item Generator */}
          <Link
            href="/magic-item-generator"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between", // Adjust spacing between image and text
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "1rem", // Adjust padding if needed
              textDecoration: "none",
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
              width: "300px", // Ensure button dimensions
              height: "300px", // Ensure button dimensions
              overflow: "hidden", // Clip overflow if necessary
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <Image
                src="/assets/homepage/magic-item.png"
                alt="Magic Item Generator"
                fill
                style={{
                  objectFit: "cover", // Ensure the image fills the container
                }}
              />
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Magic Item Generator
            </span>
          </Link>

          {/* Trap Generator */}
          <Link
            href="/trap-generator"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between", // Adjust spacing between image and text
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "1rem", // Adjust padding if needed
              textDecoration: "none",
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
              width: "300px", // Ensure button dimensions
              height: "300px", // Ensure button dimensions
              overflow: "hidden", // Clip overflow if necessary
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <Image
                src="/assets/homepage/trap.png"
                alt="Trap Generator"
                fill
                style={{
                  objectFit: "cover", // Ensure the image fills the container
                }}
              />
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Trap Generator
            </span>
          </Link>

          {/* NPC Generator */}
          <Link
            href="/npc-generator"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between", // Adjust spacing between image and text
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "1rem", // Adjust padding if needed
              textDecoration: "none",
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
              width: "300px", // Ensure button dimensions
              height: "300px", // Ensure button dimensions
              overflow: "hidden", // Clip overflow if necessary
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <Image
                src="/assets/homepage/NPC.png"
                alt="NPC Generator"
                fill
                style={{
                  objectFit: "cover", // Ensure the image fills the container
                }}
              />
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              NPC Generator
            </span>
          </Link>
        </div>
      </section>

      <footer
        style={{
          flexShrink: 0,
          textAlign: "center",
          padding: "2rem",
          fontSize: "0.9rem",
          color: "#999",
        }}
      >
        © {new Date().getFullYear()} dnd-tools.ai
      </footer>
    </div>
  );
}
