interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  samples?: number;
  steps?: number;
  cfgScale?: number;
}

interface GeneratedImage {
  id: string;
  seed: number;
  finishReason: string;
}

interface GenerateImageResponse {
  success: boolean;
  images: GeneratedImage[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
  }

  async generateImage(
    params: GenerateImageParams
  ): Promise<Blob | GenerateImageResponse> {
    const response = await fetch(`${this.baseUrl}/images/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    // Si une seule image est demandée, retourner le blob
    if (params.samples === 1) {
      return response.blob();
    }

    // Sinon retourner le JSON avec les métadonnées
    return response.json();
  }
}

export const apiService = new ApiService();
