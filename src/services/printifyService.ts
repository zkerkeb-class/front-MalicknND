// services/printifyService.ts
const BASE_URL =
  process.env.NEXT_PUBLIC_PRINTIFY_API_URL ||
  "http://localhost:3004/api/printify";

export interface Blueprint {
  id: number;
  title: string;
  brand: string;
  model: string;
  description: string;
  images: string[];
}

export interface Provider {
  id: number;
  title: string;
  description: string;
}

export interface Variant {
  id: number;
  title: string;
  options: {
    color: string;
    size: string;
  };
  costFormatted: string;
  color: string;
  size: string;
  isAvailable: boolean;
  displayName: string;
}

export interface ProductCreationData {
  title: string;
  description: string;
  imageUrl: string;
  blueprintId: number;
  printProviderId: number;
  variantIds: number[];
}

export interface CreatedProduct {
  id: string;
  title: string;
  description: string;
  blueprintId: number;
  printProviderId: number;
  variants: Array<{
    id: number;
    title: string;
    sku: string;
    price: number;
    priceFormatted: string;
    cost: number;
    profit: number;
    isEnabled: boolean;
    isDefault: boolean;
    options: number[];
  }>;
  images: Array<{
    src: string;
    variant_ids: number[];
    position: string;
    is_default: boolean;
    is_selected_for_publishing: boolean;
    order: null | number;
  }>;
  createdAt: string;
  marginApplied: number;
  originalImageUrl: string;
  printifyImageId: string;
}

class PrintifyService {
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

  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = await this.getAuthToken();

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `Erreur API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erreur lors de l'appel à ${endpoint}:`, error);
      throw error;
    }
  }

  // Récupérer tous les blueprints disponibles
  async getBlueprints(): Promise<{ data: Blueprint[] }> {
    return this.fetchApi<{ data: Blueprint[] }>("/blueprints");
  }

  // Récupérer les providers pour un blueprint spécifique
  async getProviders(blueprintId: number): Promise<{ data: Provider[] }> {
    return this.fetchApi<{ data: Provider[] }>(
      `/blueprints/${blueprintId}/providers`
    );
  }

  // Récupérer les variants pour un blueprint et provider spécifiques
  async getVariants(
    blueprintId: number,
    providerId: number
  ): Promise<{ data: Variant[] }> {
    return this.fetchApi<{ data: Variant[] }>(
      `/blueprints/${blueprintId}/providers/${providerId}/variants`
    );
  }

  // Créer un produit
  async createProduct(productData: ProductCreationData): Promise<{
    success: boolean;
    data: CreatedProduct;
    message: string;
  }> {
    return this.fetchApi("/product/create", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // Méthode utilitaire pour grouper les variants par couleur
  groupVariantsByColor(variants: Variant[]): Record<string, Variant[]> {
    return variants.reduce((acc, variant) => {
      const color = variant.color;
      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push(variant);
      return acc;
    }, {} as Record<string, Variant[]>);
  }

  // Méthode utilitaire pour obtenir les tailles disponibles pour une couleur
  getSizesForColor(variants: Variant[], color: string): string[] {
    return variants
      .filter((v) => v.color === color && v.isAvailable)
      .map((v) => v.size)
      .sort((a, b) => {
        const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
      });
  }

  // Méthode pour vérifier la santé du service Printify
  async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await fetch(
        `${BASE_URL.replace("/api/printify", "")}/health`
      );
      return response.ok;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la santé du service Printify:",
        error
      );
      return false;
    }
  }
}

export const printifyService = new PrintifyService();
