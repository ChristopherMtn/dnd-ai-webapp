"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Rarity,
  RarityToFront,
  ItemType,
  ItemTypeToFront,
  ItemPurpose,
  ItemPurposeToFront,
  MagicItemInput,
  MagicItemOutput,
} from "../types/magic-item";
import "../styles/form.css";
import "../styles/img.css";
import { magicItemImageDims } from "../prompts/magic-item";

export default function MagicItemGenerator() {
  const [magicItemDisplay, setMagicItemDisplay] = useState<MagicItemOutput>({
    rarity: "",
    description: "",
    itemType: "",
    itemPurpose: "",
    abilitiesAndEffects: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState("");
  const [magicItemInput, setMagicItemInput] = useState<MagicItemInput>({
    rarity: Rarity.Common,
    uses: "",
    itemType: "",
    itemPurpose: "",
    cursed: false,
    curses: "",
    attunement: false,
    magicCreativity: 3,
    curseCreativity: 3,
    additionalDetail: "",
  });

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDescription(true);
    setError("");
    setMagicItemDisplay({
      rarity: "",
      description: "",
      itemType: "",
      itemPurpose: "",
      abilitiesAndEffects: "",
    });
    setImageUrls([]);
    setLoadingImage(false);

    let textData: { magicItemOutput: MagicItemOutput; error?: string };

    try {
      const textResponse = await fetch("/api/generate-magic-item-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ magicItemInput }),
      });

      textData = await textResponse.json();

      if (textResponse.ok) {
        setMagicItemDisplay(textData.magicItemOutput);
      } else {
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

    // Start generating images
    setLoadingImage(true);
    try {
      const imageDescription = textData.magicItemOutput.description;
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

  const handleRarityChange = (newRarityValue: string) => {
    const rarityValue = parseInt(newRarityValue, 10);
    if (!isNaN(rarityValue)) {
      updateMagicItemInput("rarity", rarityValue as Rarity);
    }
  };

  const handleUsesChange = (newUses: string) => {
    updateMagicItemInput("uses", newUses);
  };

  const handleEnumOrStringChange = (
    key: "itemType" | "itemPurpose",
    value: string
  ) => {
    updateMagicItemInput(key, value);
  };

  const handleCursedChange = (newValue: boolean) => {
    updateMagicItemInput("cursed", newValue);
  };

  const handleCursesChange = (newCurses: string) => {
    updateMagicItemInput("curses", newCurses);
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
            {Object.values(Rarity)
              .filter((value) => typeof value === "number")
              .map((value) => (
                <option key={value} value={value}>
                  {RarityToFront[value as Rarity]}
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
          Item Type:
          <input
            type="text"
            list="itemTypeOptions"
            value={magicItemInput.itemType}
            onChange={(e) =>
              handleEnumOrStringChange("itemType", e.target.value)
            }
            disabled={loadingDescription}
          />
          <datalist id="itemTypeOptions">
            {Object.values(ItemType)
              .filter((value) => typeof value === "number")
              .map((value) => (
                <option
                  key={value}
                  value={ItemTypeToFront[value as ItemType]}
                />
              ))}
          </datalist>
        </label>

        <label>
          Item Purpose:
          <input
            type="text"
            list="itemPurposeOptions"
            value={magicItemInput.itemPurpose}
            onChange={(e) =>
              handleEnumOrStringChange("itemPurpose", e.target.value)
            }
            disabled={loadingDescription}
          />
          <datalist id="itemPurposeOptions">
            {Object.values(ItemPurpose)
              .filter((value) => typeof value === "number")
              .map((value) => (
                <option
                  key={value}
                  value={ItemPurposeToFront[value as ItemPurpose]}
                />
              ))}
          </datalist>
        </label>

        <label>
          Cursed:
          <input
            type="checkbox"
            checked={magicItemInput.cursed}
            onChange={(e) => handleCursedChange(e.target.checked)}
            disabled={loadingDescription}
          />
        </label>

        {magicItemInput.cursed && (
          <>
            <label>
              Curse Creativity (1-5):
              <input
                type="number"
                value={magicItemInput.curseCreativity}
                onChange={(e) =>
                  handleCurseCreativityChange(e.target.valueAsNumber)
                }
                disabled={loadingDescription}
                min={1}
                max={5}
              />
            </label>
            <label>
              Curse:
              <input
                type="text"
                value={magicItemInput.curses}
                onChange={(e) => handleCursesChange(e.target.value)}
                disabled={loadingDescription}
              />
            </label>
          </>
        )}

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
          Magic Creativity (1-5):
          <input
            type="number"
            value={magicItemInput.magicCreativity}
            onChange={(e) =>
              handleMagicCreativityChange(e.target.valueAsNumber)
            }
            disabled={loadingDescription}
            min={1}
            max={5}
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
                alt={`Generated DND-style Magic Item ${index + 1}`}
                width={magicItemImageDims.width}
                height={magicItemImageDims.height}
                className="img"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
