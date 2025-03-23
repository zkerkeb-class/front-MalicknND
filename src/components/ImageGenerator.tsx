"use client";

import { useState } from "react";
import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { BiImageAlt } from "react-icons/bi";
// import { apiService } from "@/services/api";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedImage(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/images/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Generation failed with status: ${response.status}`);
      }

      // Récupérer l'image en tant que Blob
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  // Nettoyer l'URL de l'objet lors du démontage du composant
  const cleanupImage = () => {
    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
    }
  };

  // Nettoyer l'URL de l'objet avant de créer une nouvelle image
  const handleNewGeneration = async () => {
    cleanupImage();
    await generateImage();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <div className="flex items-center gap-2">
            <BiImageAlt className="text-xl" />
            <span>Describe your image</span>
          </div>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene lake at sunset with mountains in the background..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleNewGeneration}
            disabled={isGenerating}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <MdOutlineGeneratingTokens
              className={`text-xl ${isGenerating ? "animate-spin" : ""}`}
            />
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {isGenerating && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Creating your masterpiece...</p>
        </div>
      )}

      {generatedImage && !isGenerating && (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={generatedImage}
              alt="Generated image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => window.open(generatedImage, "_blank")}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Download</span>
              <FiDownload className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
