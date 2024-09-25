import { TrapInput, TrapOutput } from "./trap";

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
