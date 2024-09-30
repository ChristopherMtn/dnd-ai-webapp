import { MagicItemInput } from "./magic-item";
import { TrapInput, TrapOutput } from "./trap";

// trap
export interface GenerateTrapTextRequest {
  trapInput: TrapInput;
}

export interface GenerateTrapTextResponse {
  trapOutput: TrapOutput;
  error?: string;
}

export interface GenerateTrapImageRequest {
  imageDescription: string;
}

export interface GenerateTrapImageResponse {
  imageUrls: string[];
  error?: string;
}

// magic item
export interface GenerateMagicItemTextRequest {
  magicItemInput: MagicItemInput;
}

export interface GenerateMagicItemTextResponse {
  magicItemOutput: string;
  error?: string;
}

export interface GenerateMagicItemImageRequest {
  imageDescription: string;
}

export interface GenerateMagicItemImageResponse {
  imageUrls: string[];
  error?: string;
}
