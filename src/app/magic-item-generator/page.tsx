"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Rarity,
  PresetItemType,
  MagicItemInput,
  MagicItemOutput,
} from "../types/magic-item";
import "../styles/form.css";

export default function MagicItemGenerator() {
  const [magicItemDisplay, setMagicItemDisplay] = useState<MagicItemOutput>({
    rarity: Rarity.Common,
    description: "",
    itemType: "",
    stats: JSON.parse("{}"),
    abilitiesAndEffects: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");
  const [magicItemInput, setMagicItemInput] = useState<MagicItemInput>({
    rarity: Rarity.Common,
    uses: "",
    itemTypePreset: PresetItemType.Weapon,
    itemTypeFreeText: "",
    curses: "",
    magicSpecification: "",
    statistics: JSON.parse("{}"),
    attunement: false,
    magicCreativity: 50,
    curseCreativity: 50,
    additionalDetail: "",
  });

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDescription(true);
    setError("");
    setMagicItemDisplay({
      rarity: Rarity.Common,
      description: "",
      itemType: "",
      stats: JSON.parse("{}"),
      abilitiesAndEffects: "",
    });
    setImageUrls([]);
    setLoadingImage(false);

    let textData: { magicItemOutput: MagicItemOutput; error?: string };

    try {
      // Send the magicItemInput directly to the API
      const textResponse = await fetch("/api/generate-magic-item-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ magicItemInput }),
      });

      textData = await textResponse.json();

      if (textResponse.ok) {
        console.log("output:", textData.magicItemOutput);
        setMagicItemDisplay(textData.magicItemOutput);
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
      const imageDescription = textData.magicItemOutput.description;
      // Generate Images using the Description
      const imageResponse = await fetch("/api/generate-magic-item-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageDescription }),
      });

      const imageData = await imageResponse.json();
      if (imageResponse.ok) {
        setImageUrls(imageData.imageUrls);
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

  // Handlers for form inputs
  const updateMagicItemInput = <K extends keyof MagicItemInput>(
    key: K,
    value: MagicItemInput[K]
  ) => {
    setMagicItemInput((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleRarityChange = (newRarity: string) => {
    if (newRarity in Rarity) {
      updateMagicItemInput("rarity", newRarity as Rarity);
    }
  };

  const handleUsesChange = (newUses: string) => {
    updateMagicItemInput("uses", newUses);
  };

  const handleItemTypePresetChange = (newType: string) => {
    if (newType in PresetItemType) {
      updateMagicItemInput("itemTypePreset", newType as PresetItemType);
    }
  };

  const handleItemTypeFreeTextChange = (newType: string) => {
    updateMagicItemInput("itemTypeFreeText", newType);
  };

  const handleCursesChange = (newCurses: string) => {
    updateMagicItemInput("curses", newCurses);
  };

  const handleMagicSpecificationChange = (newSpec: string) => {
    updateMagicItemInput("magicSpecification", newSpec);
  };

  const handleStatisticsChange = (newStats: string) => {
    try {
      const statsJson = JSON.parse(newStats);
      updateMagicItemInput("statistics", statsJson);
    } catch (error) {
      console.error("Invalid JSON for statistics");
      setError("Invalid JSON format for statistics.");
    }
  };

  const handleAttunementChange = (newValue: boolean) => {
    updateMagicItemInput("attunement", newValue);
  };

  const handleMagicCreativityChange = (newValue: number) => {
    updateMagicItemInput("magicCreativity", newValue);
  };

  const handleCurseCreativityChange = (newValue: number) => {
    updateMagicItemInput("curseCreativity", newValue);
  };

  const handleAdditionalDetailChange = (newDetail: string) => {
    updateMagicItemInput("additionalDetail", newDetail);
  };

  return (
    <div className="form">
      <h1>AI DND Magic Item Generator</h1>
      <form onSubmit={handleGenerateContent}>
        <label>
          Rarity:
          <select
            value={magicItemInput.rarity}
            onChange={(e) => handleRarityChange(e.target.value)}
            disabled={loadingDescription}
          >
            {Object.keys(Rarity)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <option key={key} value={key}>
                  {key.replace("_", " ")}
                </option>
              ))}
          </select>
        </label>

        <label>
          Uses:
          <input
            type="text"
            value={magicItemInput.uses}
            onChange={(e) => handleUsesChange(e.target.value)}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Item Type (Preset):
          <select
            value={magicItemInput.itemTypePreset}
            onChange={(e) => handleItemTypePresetChange(e.target.value)}
            disabled={loadingDescription}
          >
            {Object.keys(PresetItemType)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <option key={key} value={key}>
                  {key.replace("_", " ")}
                </option>
              ))}
          </select>
        </label>

        <label>
          Item Type (Free Text):
          <input
            type="text"
            value={magicItemInput.itemTypeFreeText}
            onChange={(e) => handleItemTypeFreeTextChange(e.target.value)}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Curses:
          <input
            type="text"
            value={magicItemInput.curses}
            onChange={(e) => handleCursesChange(e.target.value)}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Magic Specification:
          <textarea
            value={magicItemInput.magicSpecification}
            onChange={(e) => handleMagicSpecificationChange(e.target.value)}
            placeholder="Enter magic specifications"
            rows={3}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Statistics (JSON format):
          <textarea
            value={JSON.stringify(magicItemInput.statistics)}
            onChange={(e) => handleStatisticsChange(e.target.value)}
            placeholder='Enter statistics in JSON format (e.g., {"damage": "1d6", "weight": 2})'
            rows={3}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Attunement Required:
          <input
            type="checkbox"
            checked={magicItemInput.attunement}
            onChange={(e) => handleAttunementChange(e.target.checked)}
            disabled={loadingDescription}
          />
        </label>

        <label>
          Magic Creativity (0-100):
          <input
            type="number"
            value={magicItemInput.magicCreativity}
            onChange={(e) =>
              handleMagicCreativityChange(e.target.valueAsNumber)
            }
            disabled={loadingDescription}
            min={0}
            max={100}
          />
        </label>

        <label>
          Curse Creativity (0-100):
          <input
            type="number"
            value={magicItemInput.curseCreativity}
            onChange={(e) =>
              handleCurseCreativityChange(e.target.valueAsNumber)
            }
            disabled={loadingDescription}
            min={0}
            max={100}
          />
        </label>

        <label>
          Additional Detail:
          <textarea
            value={magicItemInput.additionalDetail}
            onChange={(e) => handleAdditionalDetailChange(e.target.value)}
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

      {magicItemDisplay.description && (
        <div>
          <h2>Magic Item Details:</h2>
          <p>
            <strong>Rarity:</strong> {magicItemDisplay.rarity}
          </p>
          <p>
            <strong>Item Type:</strong> {magicItemDisplay.itemType}
          </p>
          <p>
            <strong>Description:</strong> {magicItemDisplay.description}
          </p>
          <p>
            <strong>Abilities and Effects:</strong>{" "}
            {magicItemDisplay.abilitiesAndEffects}
          </p>
          <p>
            <strong>Statistics:</strong>{" "}
            {JSON.stringify(magicItemDisplay.stats)}
          </p>
        </div>
      )}

      {loadingImage && (
        <div>
          <p>Generating images...</p>
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

      {imageUrls.length > 0 && (
        <div>
          <h2>Images:</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Generated DND-style Magic Item ${index + 1}`}
                width={256}
                height={256}
                style={{ border: "1px solid #ccc", borderRadius: "4px" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
