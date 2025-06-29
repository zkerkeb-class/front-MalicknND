"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiDownload, FiTrash2, FiPrinter } from "react-icons/fi";
import { apiService } from "@/services/api";
import { useUser } from "@clerk/nextjs";

// Import du nouveau composant ProductCreatorForm
import ProductCreatorForm from "@/components/ProductCreatorForm";

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

  // États pour le système d'impression avec le nouveau créateur
  const [selectedImageForPrint, setSelectedImageForPrint] =
    useState<SavedImage | null>(null);
  const [showPrintCreator, setShowPrintCreator] = useState(false);

  // État pour les notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  // Gérer le clic sur "Imprimer"
  const handlePrintClick = (image: SavedImage, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la navigation

    setSelectedImageForPrint(image);
    setShowPrintCreator(true);
  };

  // Fermer le créateur de produit
  const handleClosePrintCreator = () => {
    setShowPrintCreator(false);
    setSelectedImageForPrint(null);
  };

  // Quand un produit est créé avec succès
  const handleProductCreated = (productId: string) => {
    console.log("🎉 Produit Printify créé:", productId);

    // Afficher une notification de succès
    setNotification({
      type: "success",
      message: `Produit créé avec succès ! ID: ${productId}`,
    });

    // Masquer la notification après 5 secondes
    setTimeout(() => {
      setNotification(null);
    }, 5000);

    // Mettre à jour le statut de l'image
    if (selectedImageForPrint) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === selectedImageForPrint.id
            ? { ...img, status: "printed" }
            : img
        )
      );
    }

    // Fermer le créateur
    handleClosePrintCreator();
  };

  // Gérer la suppression d'une image
  const handleDeleteImage = async (image: SavedImage, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Supprimer l'image "${image.prompt.slice(0, 50)}..." ?`)) {
      return;
    }

    try {
      // Ici tu peux ajouter l'appel API pour supprimer l'image
      // await apiService.deleteImage(image.id);

      // Pour l'instant, on la supprime juste localement
      setImages((prev) => prev.filter((img) => img.id !== image.id));

      setNotification({
        type: "success",
        message: "Image supprimée avec succès",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Erreur lors de la suppression",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
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

  // Si on affiche le créateur de produit, montrer seulement ça
  if (showPrintCreator && selectedImageForPrint) {
    const printifyImageFormat = {
      id: selectedImageForPrint.id,
      url: selectedImageForPrint.imageUrl,
      title:
        selectedImageForPrint.prompt.slice(0, 50) +
        (selectedImageForPrint.prompt.length > 50 ? "..." : ""),
      width: 1024,
      height: 1024,
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <ProductCreatorForm
          selectedImage={printifyImageFormat}
          onProductCreated={handleProductCreated}
          onCancel={handleClosePrintCreator}
        />
      </div>
    );
  }

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
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {notification.type === "success" ? "✅" : "❌"}
            </span>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
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

              {/* Overlay avec bouton Imprimer en gros sur hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={(e) => handlePrintClick(image, e)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium transform hover:scale-105"
                >
                  🖨️ Créer un produit
                </button>
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

              {/* Actions */}
              <div className="flex gap-1">
                {/* Télécharger */}
                <a
                  href={image.imageUrl}
                  download={`${image.prompt.slice(0, 30)}.png`}
                  className="flex-1 flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Télécharger"
                >
                  <FiDownload className="text-sm" />
                </a>

                {/* Créer un produit Printify */}
                <button
                  className={`flex-1 flex items-center justify-center p-2 transition-colors ${
                    image.status === "printed"
                      ? "text-purple-500 hover:text-purple-700"
                      : "text-blue-500 hover:text-blue-700"
                  }`}
                  title={
                    image.status === "printed"
                      ? "Déjà transformé en produit"
                      : "Créer un produit Printify"
                  }
                  onClick={(e) => handlePrintClick(image, e)}
                >
                  <FiPrinter className="text-sm" />
                </button>

                {/* Supprimer */}
                <button
                  className="flex-1 flex items-center justify-center p-2 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={(e) => handleDeleteImage(image, e)}
                  title="Supprimer"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>

              {/* Bouton Créer un produit visible sur mobile */}
              <button
                onClick={(e) => handlePrintClick(image, e)}
                className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium md:hidden"
              >
                🖨️ Créer un produit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
