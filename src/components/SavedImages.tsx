"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiDownload, FiTrash2, FiPrinter } from "react-icons/fi";
import { apiService } from "@/services/api";
import { useUser } from "@clerk/nextjs";
import PrintifyProductCreator from "./PrintifyProductCreator";

// Interface pour les données venant de l'API
interface ApiImage {
  id?: string;
  image_id?: string;
  user_id?: string;
  userId?: string;
  prompt: string;
  image_url?: string;
  imageUrl?: string;
  created_at?: string;
  createdAt?: string;
  status: string;
  metadata?: Record<string, string | number | boolean>;
}

// Interface normalisée pour l'utilisation dans le composant
interface SavedImage {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  status: string;
  metadata?: Record<string, string | number | boolean>;
}

export default function SavedImages() {
  const { user, isLoaded } = useUser();
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printifyModalOpen, setPrintifyModalOpen] = useState(false);
  const [selectedImageForPrint, setSelectedImageForPrint] =
    useState<SavedImage | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadImages();
    } else if (isLoaded && !user) {
      setLoading(false);
      setError("Vous devez être connecté pour voir vos images");
    }
  }, [isLoaded, user]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserImages();

      // Normalisation des données API vers notre interface
      const normalizedImages: SavedImage[] = (response.data.images || []).map(
        (img: ApiImage) => ({
          id: img.id || img.image_id || `image-${Date.now()}-${Math.random()}`,
          userId: img.userId || img.user_id || "",
          prompt: img.prompt || "",
          imageUrl: img.imageUrl || img.image_url || "",
          createdAt:
            img.createdAt || img.created_at || new Date().toISOString(),
          status: img.status || "generated",
          metadata: img.metadata,
        })
      );

      setImages(normalizedImages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des images"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement de vos images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadImages}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Aucune image sauvegardée.</p>
        <p className="text-sm text-gray-500">
          Générez une image avec l&apos;option &quot;Sauvegarder&quot; activée
          pour la voir apparaître ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Vos Images Sauvegardées ({images.length})
        </h2>
        <button
          onClick={loadImages}
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="relative aspect-square">
              {image.imageUrl ? (
                <Image
                  src={image.imageUrl}
                  alt={image.prompt || "Image générée"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index === 0}
                  className="object-cover"
                  onError={() => {
                    console.error(
                      "Erreur de chargement d'image:",
                      image.imageUrl
                    );
                    // Optionnel: remplacer par une image de fallback
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Indisponible</span>
                </div>
              )}

              {/* Badge statut */}
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    image.status === "generated"
                      ? "bg-green-100 text-green-800"
                      : image.status === "ready_to_print"
                      ? "bg-blue-100 text-blue-800"
                      : image.status === "printed"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {image.status === "generated"
                    ? "✨"
                    : image.status === "ready_to_print"
                    ? "🖨️"
                    : image.status === "printed"
                    ? "📦"
                    : "📄"}
                </span>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {/* Prompt tronqué */}
              <p className="text-xs text-gray-700 line-clamp-2 leading-tight">
                {image.prompt}
              </p>

              {/* Date */}
              <p className="text-xs text-gray-500">
                {formatDate(image.createdAt)}
              </p>

              {/* Icônes sans actions */}
              <div className="flex gap-1">
                <div className="flex-1 flex items-center justify-center p-2 text-gray-400">
                  <FiDownload className="text-sm" />
                </div>
                <button
                  className="flex-1 flex items-center justify-center p-2 text-blue-500 hover:text-blue-700"
                  title="Imprimer sur Printify"
                  onClick={() => {
                    setSelectedImageForPrint(image);
                    setPrintifyModalOpen(true);
                  }}
                >
                  <FiPrinter className="text-sm" />
                </button>
                <div className="flex-1 flex items-center justify-center p-2 text-gray-400">
                  <FiTrash2 className="text-sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modale Printify */}
      <PrintifyProductCreator
        isOpen={printifyModalOpen}
        onClose={() => setPrintifyModalOpen(false)}
        imageUrl={selectedImageForPrint?.imageUrl || ""}
        // imageFile={...} // Optionnel si tu veux uploader le fichier
        onProductCreated={() => {
          setPrintifyModalOpen(false);
          setSelectedImageForPrint(null);
        }}
      />
    </div>
  );
}
