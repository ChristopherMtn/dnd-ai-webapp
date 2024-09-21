"use client";

import { useState } from "react";
import Image from "next/image";
import { GenerateTrapTextResponse } from "./types";
import { GenerateTrapImageResponse } from "./types";
import { DangerLevel, TrapInput, TrapOutput } from "./types";

export default function Home() {
  const [description, setDescription] = useState("");
  const [trapDisplay, setTrapDisplay] = useState<TrapOutput>({
    description: "",
    trigger: "",
    countermeasures: "",
    effect: "",
  });
  const [imageUrl, setImageUrl] = useState("");
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
  const { dangerLevel } = trapInput

  const createPrompt = (trap: TrapInput) => {
    const magic: string = trap.magic ? "magical" : "non-magical";
    const characterLevel: string = trap.CharacterLevel.toString();
    let danger: string = "";
    switch (trap.dangerLevel) {
      case DangerLevel.Deterrent:
        danger = "deter but not harm";
        break;
      case DangerLevel.Harmful:
        danger = "harm but not kill";
        break;
      case DangerLevel.Lethal:
        danger = "potentially kill";
        break;
    }
    let prompt: string = `
      Create a ${magic} trap for D&D 5e that is appropriate for a party of level ${characterLevel} characters.
      The trap should be designed to ${danger} players.`;
    if (trap.environment.trim() != "") {
      prompt = prompt + `\nInformation about where the trap is: ${trap.environment}`;
    }
    if (trap.additionalDetail.trim() != "") {
      prompt = prompt + `\nAdditional details: ${trap.additionalDetail}`;
    }
    prompt = prompt + `\nRespond with a simple, un-nested JSON object in the following format: {"description":"example text", "trigger":"example text", "countermeasures":"example text", "effect":"example text"}`;
    return prompt
  }

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDescription(true);
    setError("");
    setDescription("");
    setTrapDisplay({
      description: "",
      trigger: "",
      countermeasures: "",
      effect: "",
    });
    setImageUrl("");
    setLoadingImage(false);

    let descriptionText = "";

    try {
      const prompt: string = createPrompt(trapInput);
      console.log(prompt)
      // Generate Description
      const textResponse = await fetch("/api/generate-trap-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const textData = (await textResponse.json()) as GenerateTrapTextResponse;
      let trapData: TrapOutput = {
        description: "",
        trigger: "",
        countermeasures: "",
        effect: "",
      };
      if (textResponse.ok) {
        console.log("output:", textData.description);
        setDescription(textData.description);
        descriptionText = textData.description;
        trapData = JSON.parse(textData.description)
        setTrapDisplay(trapData);
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

  const updateTrapInput = <K extends keyof TrapInput>(key: K, value: TrapInput[K]) => {
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
    updateTrapInput("magic", newValue)
  }

  const handlePlayerLevelChange = (newLevel: number) => {
    updateTrapInput("CharacterLevel", newLevel);
  };

  const handleLocationChange = (newEnvironment: string) => {
    updateTrapInput("environment", newEnvironment);
  };

  const handleExtraInfoChange = (newInfo: string) => {
    updateTrapInput("additionalDetail", newInfo);
  }

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
        <br />
        <label>
          Magical:
          <span> </span>
          <input
            type="checkbox"
            checked={trapInput.magic}
            onChange={(e) => handleMagicalCheck(e.target.checked)}
            disabled={loadingDescription}
          />
        </label>
        <br />
        <label>
          Average Player Level:
          <span> </span>
          <input
            type="number"
            value={trapInput.CharacterLevel}
            onChange={(e) => handlePlayerLevelChange(e.target.valueAsNumber)}
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
            value={trapInput.environment}
            onChange={(e) => handleLocationChange(e.target.value)}
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
            value={trapInput.additionalDetail}
            onChange={(e) => handleExtraInfoChange(e.target.value)}
            placeholder="Enter any extra info"
            rows={3}
            cols={60}
            disabled={loadingDescription} // Disable input while loading description
          />
        </label>
        <br />
        <button type="submit" disabled={loadingDescription}>
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
