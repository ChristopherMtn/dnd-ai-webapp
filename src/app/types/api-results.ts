export interface GenerateTrapTextRequest {
  prompt: string;
}

export interface GenerateTrapTextResponse {
  description: string;
  error: string;
}

export interface GenerateTrapImageRequest {
  imageDescription: string;
}

export interface GenerateTrapImageResponse {
  imageUrl: string;
  error: string;
}
