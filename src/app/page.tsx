"use client";

import { useState } from "react";
import Image from "next/image";
import { GenerateTrapTextResponse } from "./types";
import { GenerateTrapImageResponse } from "./types";
import { DangerLevel } from "./types";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");
  const [dangerLevel, setDangerLevel] = useState<string | DangerLevel>("");
  const [isMagical, setIsMagical] = useState<boolean>(false);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [location, setLocation] = useState<string>("");

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDescription(true);
    setError("");
    setDescription("");
    setImageUrl("");
    setLoadingImage(false);

    let descriptionText = "";

    try {
      // Generate Description
      const textResponse = await fetch("/api/generate-trap-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const textData = (await textResponse.json()) as GenerateTrapTextResponse;
      console.log("Text Data:", textData);
      if (textResponse.ok) {
        setDescription(textData.description);
        descriptionText = textData.description;
      } else {
        console.error("Error from text API:", textData.error);
        setError(textData.error || "An error occurred during text generation.");
        setLoadingDescription(false);
        return;
      }
    } catch (err) {
      console.error("Error during content generation:", err);
      setError("An unexpected error occurred.");
      setLoadingDescription(false);
      return;
    } finally {
      setLoadingDescription(false);
    }

    // Use textData.description directly
    const imageDescription = descriptionText;

    // After description is set, start generating the image
    setLoadingImage(true);
    try {
      // Generate Image using the Description
      const imageResponse = await fetch("/api/generate-trap-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageDescription }),
      });

      const imageData =
        (await imageResponse.json()) as GenerateTrapImageResponse;
      if (imageResponse.ok) {
        setImageUrl(imageData.imageUrl);
      } else {
        console.error("Error from image API:", imageData.error);
        setError(
          imageData.error || "An error occurred during image generation."
        );
        setLoadingImage(false);
        return;
      }
    } catch (err) {
      console.error("Error during image generation:", err);
      setError("An unexpected error occurred.");
      setLoadingImage(false);
      return;
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI DND Trap Generator</h1>
      <br />
      <u>Form:</u>
      <form onSubmit={handleGenerateContent}>
        <label>
          Danger Level:
          <select
            value={dangerLevel}
            onChange={(e) => setDangerLevel(e.target.value)}
            disabled={loadingDescription}
          >
            <option value="">-- Select a Danger Level --</option>
            {Object.keys(DangerLevel)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
          </select>
        </label>
        <br />
        <label>
          Magical:
          <span> </span>
          <input
            type="checkbox"
            checked={isMagical}
            onChange={(e) => setIsMagical(e.target.checked)}
            disabled={loadingDescription}
          />
        </label>
        <br />
        <label>
          Average Player Level:
          <span> </span>
          <input
            type="number"
            value={playerLevel}
            onChange={(e) => setPlayerLevel(e.target.valueAsNumber)}
            disabled={loadingDescription}
            min={1}
            max={20}
          />
        </label>
        <br />
        <label>
          Location:
          <br />
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location info"
            rows={3}
            cols={60}
            disabled={loadingDescription} // Disable input while loading description
          />
        </label>
        <br />
        <label>
          Extra Info:
          <br />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter any extra info"
            rows={3}
            cols={60}
            disabled={loadingDescription} // Disable input while loading description
          />
        </label>
        <br />
        <button type="submit" disabled={loadingDescription || !prompt.trim()}>
          {loadingDescription
            ? "Generating Description..."
            : "Generate Content"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {description && (
        <div>
          <h2>Description:</h2>
          <p>{description}</p>
        </div>
      )}
      {loadingImage && (
        <div>
          <p>Generating image...</p>
          <div
            style={{
              border: "4px solid rgba(0, 0, 0, 0.1)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              borderLeftColor: "#09f",
              animation: "spin 1s linear infinite",
              margin: "20px auto",
            }}
          ></div>
        </div>
      )}
      {imageUrl && (
        <div>
          <h2>Image:</h2>
          <Image
            src={imageUrl}
            alt="Generated DND-style"
            width={1024}
            height={1024}
          />
        </div>
      )}
    </div>
  );
}
