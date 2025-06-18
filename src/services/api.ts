interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  samples?: number;
  steps?: number;
  cfgScale?: number;
  saveToStorage?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

interface GeneratedImage {
  id: string;
  seed: number;
  finishReason: string;
}

interface SavedImage {
  image_id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  status: string;
  metadata?: Record<string, string | number | boolean>;
}

interface GenerateImageResponse {
  success: boolean;
  images: GeneratedImage[];
  savedImages?: SavedImage[];
}

interface UserImagesResponse {
  success: boolean;
  data: {
    images: SavedImage[];
    total: number;
    page: number;
    limit: number;
  };
}

class ApiService {
  private baseUrl: string;
  private imageServiceUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
    this.imageServiceUrl =
      process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL || "http://localhost:5002/api";
  }

  async generateImage(
    params: GenerateImageParams
  ): Promise<Blob | GenerateImageResponse> {
    // Récupérer le token d'authentification depuis Clerk
    const token = await this.getAuthToken();
    console.log("Token:", token);

    const response = await fetch(`${this.baseUrl}/images/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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

  async getUserImages(
    page: number = 1,
    limit: number = 10
  ): Promise<UserImagesResponse> {
    const token = await this.getAuthToken();

    const response = await fetch(
      `${this.imageServiceUrl}/images/user?page=${page}&limit=${limit}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user images");
    }

    return response.json();
  }

  async getImageById(
    imageId: string
  ): Promise<{ success: boolean; data: SavedImage }> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.imageServiceUrl}/images/${imageId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    return response.json();
  }

  async deleteImage(
    imageId: string
  ): Promise<{ success: boolean; message: string }> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.imageServiceUrl}/images/${imageId}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    return response.json();
  }

  async updateImageStatus(
    imageId: string,
    status: string
  ): Promise<{ success: boolean; data: SavedImage }> {
    const token = await this.getAuthToken();

    const response = await fetch(
      `${this.imageServiceUrl}/images/${imageId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update image status");
    }

    return response.json();
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Récupérer le token depuis Clerk avec le bon template
      if (typeof window !== "undefined") {
        console.log("Window disponible, vérification de Clerk...");

        // @ts-expect-error - Clerk est disponible globalement
        if (window.Clerk) {
          console.log("Clerk disponible");
          // @ts-expect-error - Clerk session getToken method
          if (window.Clerk.session) {
            console.log("Session Clerk disponible");
            // @ts-expect-error - Clerk session getToken method
            const token = await window.Clerk.session.getToken();
            if (token) {
              console.log("Token Clerk récupéré avec succès");
              return token;
            } else {
              console.error("Token Clerk null - session non authentifiée");
            }
          } else {
            console.error(
              "Session Clerk non disponible - utilisateur non connecté"
            );
          }
        } else {
          console.error("Clerk non disponible dans window");
        }
      } else {
        console.error("Window non disponible (SSR)");
      }

      console.error("Aucun token Clerk disponible - utilisateur non connecté");
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du token Clerk:", error);
      return null;
    }
  }

  // Méthode pour vérifier la santé des services
  async checkServicesHealth() {
    const services = {
      ia: `${this.baseUrl.replace("/api", "")}/health`,
      image: `${this.imageServiceUrl.replace("/api", "")}/health`,
      bdd: "http://localhost:9002/api/health",
    };

    const results = await Promise.allSettled([
      fetch(services.ia),
      fetch(services.image),
      fetch(services.bdd),
    ]);

    return {
      ia: results[0].status === "fulfilled" && results[0].value.ok,
      image: results[1].status === "fulfilled" && results[1].value.ok,
      bdd: results[2].status === "fulfilled" && results[2].value.ok,
    };
  }
}

export const apiService = new ApiService();
