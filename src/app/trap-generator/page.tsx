"use client";

import { useState } from "react";
import Image from "next/image";
import { GenerateTrapTextResponse, GenerateTrapImageResponse } from "../types";
import { DangerLevel, TrapInput, TrapOutput } from "../types";
import { trapImageDims } from "../prompts/trap";
import "../styles/form.css";
import "../styles/img.css";

export default function TrapGenerator() {
  const [trapDisplay, setTrapDisplay] = useState<TrapOutput>({
    description: "",
    trigger: "",
    countermeasures: "",
    effect: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Changed from imageUrl to imageUrls
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");
  const [trapInput, setTrapInput] = useState<TrapInput>({
    magic: false,
    dangerLevel: DangerLevel.Deterrent,
    environment: "",
    CharacterLevel: 1,
    additionalDetail: "",
  });
  const { dangerLevel } = trapInput;

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDescription(true);
    setError("");
    setTrapDisplay({
      description: "",
      trigger: "",
      countermeasures: "",
      effect: "",
    });
    setImageUrls([]); // Reset image URLs
    setLoadingImage(false);

    let textData: GenerateTrapTextResponse;

    try {
      // Send the trapInput directly to the API
      const textResponse = await fetch("/api/generate-trap-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trapInput }),
      });

      textData = (await textResponse.json()) as GenerateTrapTextResponse;

      if (textResponse.ok) {
        console.log("output:", textData.trapOutput);
        setTrapDisplay(textData.trapOutput);
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

    // After description is set, start generating the images
    setLoadingImage(true);
    try {
      const imageDescription = textData.trapOutput.description;
      // Generate Images using the Description
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
        setImageUrls(imageData.imageUrls); // Set image URLs
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

  const updateTrapInput = <K extends keyof TrapInput>(
    key: K,
    value: TrapInput[K]
  ) => {
    setTrapInput((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleDangerLevelChange = (newLevel: string) => {
    if (newLevel in DangerLevel) {
      updateTrapInput("dangerLevel", newLevel as DangerLevel);
    }
  };

  const handleMagicalCheck = (newValue: boolean) => {
    updateTrapInput("magic", newValue);
  };

  const handlePlayerLevelChange = (newLevel: number) => {
    updateTrapInput("CharacterLevel", newLevel);
  };

  const handleLocationChange = (newEnvironment: string) => {
    updateTrapInput("environment", newEnvironment);
  };

  const handleExtraInfoChange = (newInfo: string) => {
    updateTrapInput("additionalDetail", newInfo);
  };

  return (
    <div className="form">
      <h1>AI DND Trap Generator</h1>
      <form onSubmit={handleGenerateContent}>
        <label>
          Danger Level:
          <select
            value={dangerLevel}
            onChange={(e) => handleDangerLevelChange(e.target.value)}
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

        <label>
          <input
            type="checkbox"
            checked={trapInput.magic}
            onChange={(e) => handleMagicalCheck(e.target.checked)}
            disabled={loadingDescription}
          />
          Magical
        </label>

        <label>
          Average Player Level:
          <input
            type="number"
            value={trapInput.CharacterLevel}
            onChange={(e) => handlePlayerLevelChange(e.target.valueAsNumber)}
            disabled={loadingDescription}
            min={1}
            max={20}
          />
        </label>

        <label>
          Location:
          <textarea
            value={trapInput.environment}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Enter location info"
            rows={3}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Extra Info:
          <textarea
            value={trapInput.additionalDetail}
            onChange={(e) => handleExtraInfoChange(e.target.value)}
            placeholder="Enter any extra info"
            rows={3}
            disabled={loadingDescription}
          />
        </label>

        <button type="submit" disabled={loadingDescription}>
          {loadingDescription
            ? "Generating Description..."
            : "Generate Content"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {trapDisplay.description && (
        <div>
          <h2>Trap Details:</h2>
          <p>
            <strong>Description:</strong> {trapDisplay.description}
          </p>
          <p>
            <strong>Trigger:</strong> {trapDisplay.trigger}
          </p>
          <p>
            <strong>Countermeasures:</strong> {trapDisplay.countermeasures}
          </p>
          <p>
            <strong>Effect:</strong> {trapDisplay.effect}
          </p>
          <div className="modify-buttons">
            <button id="less-button">&#x2212; Less Dangerous</button>
            <button id="more-button">More Dangerous &#x2b;</button>
          </div>
        </div>
      )}

      {loadingImage && (
        <div className="img-loading">
          <p>Generating images...</p>
        </div>
      )}

      {imageUrls.length > 0 && (
        <div>
          <h2>Images:</h2>
          <div className="img-display">
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Generated DND-style Trap ${index + 1}`}
                width={trapImageDims.width}
                height={trapImageDims.height}
                className="img"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
