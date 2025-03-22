"use client";

import { useState } from "react";
import Image from "next/image";
import { apiService } from "@/services/api";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [samples, setSamples] = useState(1);
  const [steps, setSteps] = useState(30);
  const [cfgScale, setCfgScale] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await apiService.generateImage({
        prompt,
        width,
        height,
        samples,
        steps,
        cfgScale,
      });

      if (result instanceof Blob) {
        const imageUrl = URL.createObjectURL(result);
        setGeneratedImage(imageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700"
          >
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="width"
              className="block text-sm font-medium text-gray-700"
            >
              Largeur
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={512}
              max={2048}
              step={64}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700"
            >
              Hauteur
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={512}
              max={2048}
              step={64}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="samples"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre d&apos;images
            </label>
            <input
              type="number"
              id="samples"
              value={samples}
              onChange={(e) => setSamples(Number(e.target.value))}
              min={1}
              max={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="steps"
              className="block text-sm font-medium text-gray-700"
            >
              Étapes
            </label>
            <input
              type="number"
              id="steps"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              min={10}
              max={50}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="cfgScale"
              className="block text-sm font-medium text-gray-700"
            >
              CFG Scale
            </label>
            <input
              type="number"
              id="cfgScale"
              value={cfgScale}
              onChange={(e) => setCfgScale(Number(e.target.value))}
              min={0}
              max={35}
              step={0.5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Génération en cours..." : "Générer l'image"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Image générée
          </h2>
          <div className="relative aspect-square w-full max-w-2xl mx-auto">
            <Image
              src={generatedImage}
              alt="Image générée"
              fill
              className="rounded-lg shadow-lg object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
