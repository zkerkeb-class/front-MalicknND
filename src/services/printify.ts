import { apiService } from "./api";

const PRINTIFY_API_BASE =
  process.env.NEXT_PUBLIC_PRINTIFY_SERVICE_URL ||
  "http://localhost:3004/api/printify";

async function getAuthToken() {
  // @ts-expect-error: apiService.getAuthToken n'est pas exporté publiquement mais existe en interne
  return apiService.getAuthToken ? await apiService.getAuthToken() : null;
}

export const printifyService = {
  async getBlueprints() {
    const token = await getAuthToken();
    const res = await fetch(`${PRINTIFY_API_BASE}/blueprints`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
    if (!res.ok) throw new Error("Erreur récupération blueprints");
    const data = await res.json();
    return data.data;
  },
  async getPrintProviders(blueprintId: number) {
    const token = await getAuthToken();
    const res = await fetch(
      `${PRINTIFY_API_BASE}/blueprints/${blueprintId}/print-providers`,
      {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      }
    );
    if (!res.ok) throw new Error("Erreur récupération providers");
    const data = await res.json();
    return data.data;
  },
  async getVariants(blueprintId: number, printProviderId: number) {
    const token = await getAuthToken();
    const res = await fetch(
      `${PRINTIFY_API_BASE}/blueprints/${blueprintId}/print-providers/${printProviderId}/variants`,
      {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      }
    );
    if (!res.ok) throw new Error("Erreur récupération variants");
    const data = await res.json();
    return data.data;
  },
  async getShops() {
    const token = await getAuthToken();
    const res = await fetch(`${PRINTIFY_API_BASE}/shops`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Erreur récupération shops: ${res.status} - ${errText}`);
    }
    const data = await res.json();
    return data.data;
  },
  async uploadImage(file: File) {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${PRINTIFY_API_BASE}/upload-image`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    if (!res.ok) throw new Error("Erreur upload image");
    const data = await res.json();
    return data.data;
  },
  async createProduct(productData: Record<string, unknown>) {
    const token = await getAuthToken();
    const res = await fetch(`${PRINTIFY_API_BASE}/create-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error("Erreur création produit");
    const data = await res.json();
    return data.data;
  },
  async uploadImageFromUrl(url: string) {
    const token = await getAuthToken();
    const res = await fetch(`${PRINTIFY_API_BASE}/upload-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ imageUrl: url }),
    });
    if (!res.ok) throw new Error("Erreur upload image");
    const data = await res.json();
    return data.data;
  },
};
