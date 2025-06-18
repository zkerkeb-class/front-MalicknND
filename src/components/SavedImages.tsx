"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiDownload, FiTrash2, FiEye } from "react-icons/fi";
import { apiService } from "@/services/api";

interface SavedImage {
  image_id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  status: string;
  metadata?: Record<string, string | number | boolean>;
}

export default function SavedImages() {
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SavedImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserImages();
      setImages(response.data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await apiService.deleteImage(imageId);
      setImages(images.filter((img) => img.image_id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const handleUpdateStatus = async (imageId: string, status: string) => {
    try {
      await apiService.updateImageStatus(imageId, status);
      setImages(
        images.map((img) =>
          img.image_id === imageId ? { ...img, status } : img
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
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
        <p className="mt-4 text-gray-600">Loading your images...</p>
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
          Retry
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No saved images yet.</p>
        <p className="text-sm text-gray-500">
          Generate an image with &quot;Save to Storage&quot; enabled to see it
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Saved Images</h2>
        <button
          onClick={loadImages}
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.image_id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={image.image_url}
                alt={image.prompt}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700 line-clamp-2">
                {image.prompt}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(image.created_at)}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    image.status === "generated"
                      ? "bg-green-100 text-green-800"
                      : image.status === "printed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {image.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.open(image.image_url, "_blank")}
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiDownload className="text-lg" />
                  Download
                </button>

                <button
                  onClick={() => setSelectedImage(image)}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiEye className="text-lg" />
                </button>

                <button
                  onClick={() => handleDeleteImage(image.image_id)}
                  className="flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="text-lg" />
                </button>
              </div>

              <select
                value={image.status}
                onChange={(e) =>
                  handleUpdateStatus(image.image_id, e.target.value)
                }
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="generated">Generated</option>
                <option value="printed">Printed</option>
                <option value="ordered">Ordered</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour voir les détails de l'image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Image Details
                </h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prompt
                  </label>
                  <p className="text-gray-900">{selectedImage.prompt}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedImage.created_at)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="text-gray-900">{selectedImage.status}</p>
                </div>

                {selectedImage.metadata &&
                  Object.keys(selectedImage.metadata).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Metadata
                      </label>
                      <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedImage.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
