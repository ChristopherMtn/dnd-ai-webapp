"use client";

import { useState } from "react";
import Image from "next/image";
import { GenerateTrapTextResponse, GenerateTrapImageResponse } from "../types";
import { DangerLevel, TrapInput, TrapOutput } from "../types";
import { trapImageDims } from "../prompts/trap";
import { handlePrint } from "../utils/printHandler";
import "../styles/form.css";
import "../styles/img.css";
import "../styles/phb.standalone.css";

export default function TrapGenerator() {
  const [trapDisplay, setTrapDisplay] = useState<TrapOutput>({
    name: "",
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
      name: "",
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

  const handleLessDangerous = async () => {
    // make API call with current information to update it
    if (!trapDisplay) {
      console.log(
        "[WARNING] handleLessDangerous triggered but trap display object is not set"
      );
      return;
    }
    setLoadingDescription(true);
    setError("");
    let textData: GenerateTrapTextResponse;
    try {
      // Send the trapInput directly to the API
      const textResponse = await fetch("/api/generate-less-trap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...trapDisplay }),
      });

      textData = (await textResponse.json()) as GenerateTrapTextResponse;

      if (textResponse.ok) {
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
  };

  const handleMoreDangerous = async () => {
    // make API call with current information to update it
    if (!trapDisplay) {
      console.log(
        "[WARNING] handleMoreDangerous triggered but trap display object is not set"
      );
      return;
    }
    setLoadingDescription(true);
    setError("");
    let textData: GenerateTrapTextResponse;
    try {
      // Send the trapInput directly to the API
      const textResponse = await fetch("/api/generate-more-trap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...trapDisplay }),
      });

      textData = (await textResponse.json()) as GenerateTrapTextResponse;

      if (textResponse.ok) {
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
        <>
          {/* Trap Display Section */}
          <div id="section-to-print" className="phb">
            <h2>{trapDisplay.name}</h2>
            <div className="phb-columns">
              {/* Left Column */}
              <div className="left-column">
                <div>
                  <h3>Description</h3>
                  <p>{trapDisplay.description}</p>
                </div>
                <div>
                  <h3>Trigger</h3>
                  <p>{trapDisplay.trigger}</p>
                </div>
                <div>
                  <h3>Countermeasures</h3>
                  <p>{trapDisplay.countermeasures}</p>
                </div>
                <div>
                  <h3>Effect</h3>
                  <p>{trapDisplay.effect}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column">
                {imageUrls.length > 0 ? (
                  <div>
                    <Image
                      src={imageUrls[0]}
                      alt="Generated DND-style Trap"
                      width={trapImageDims.width}
                      height={trapImageDims.height}
                    />
                  </div>
                ) : (
                  loadingImage && (
                    <div className="phb-loading-block">
                      <p>Generating image...</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="button-group">
            <div className="modify-buttons">
              <button
                id="less-button"
                type="button"
                onClick={handleLessDangerous}
                disabled={loadingDescription}
                className="phb-button"
              >
                &#x2212; Less Dangerous
              </button>
              <button
                id="more-button"
                type="button"
                onClick={handleMoreDangerous}
                disabled={loadingDescription}
                className="phb-button"
              >
                More Dangerous &#x2b;
              </button>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="phb-button print-button"
            >
              Download as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
