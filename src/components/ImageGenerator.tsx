"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiDownload, FiSave, FiCreditCard } from "react-icons/fi";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { BiImageAlt } from "react-icons/bi";
import { apiService } from "@/services/api";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ImageGenerator() {
  const { user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [advancedSettings, setAdvancedSettings] = useState({
    width: 1024,
    height: 1024,
    steps: 30,
    cfgScale: 7,
    samples: 1,
  });

  // Charger les crédits de l'utilisateur
  useEffect(() => {
    if (user?.id) {
      loadUserCredits();
    }
  }, [user?.id]);

  const loadUserCredits = async () => {
    try {
      setIsLoadingCredits(true);
      const credits = await paymentService.getUserCredits(user!.id);
      setUserCredits(credits.credits);
    } catch (error) {
      console.error("Error loading credits:", error);
      setUserCredits(0);
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description.");
      return;
    }

    if (!user?.id) {
      toast.error("Vous devez être connecté pour générer une image.");
      return;
    }

    // Vérifier les crédits avant de générer
    if (userCredits <= 0) {
      toast.error(
        "Vous n'avez plus de crédits. Veuillez en acheter pour continuer."
      );
      router.push("/pricing");
      return;
    }

    // Afficher un toast de chargement
    const promise = new Promise(async (resolve, reject) => {
      try {
        setIsGenerating(true);
        setError(null);
        setGeneratedImage(null);

        // Utiliser un crédit avant de générer
        const creditResult = await paymentService.useCredits(user.id, 1);
        setUserCredits(creditResult.remainingCredits);

        const params = {
          prompt: prompt.trim(),
          width: advancedSettings.width,
          height: advancedSettings.height,
          steps: advancedSettings.steps,
          cfgScale: advancedSettings.cfgScale,
          samples: advancedSettings.samples,
          metadata: {
            generated_by: "frontend",
            timestamp: new Date().toISOString(),
            width: advancedSettings.width.toString(),
            height: advancedSettings.height.toString(),
            steps: advancedSettings.steps.toString(),
            cfgScale: advancedSettings.cfgScale.toString(),
          },
        };

        const response = await apiService.generateImage(params);

        if (response instanceof Blob) {
          const imageUrl = URL.createObjectURL(response);
          setGeneratedImage(imageUrl);
          resolve(imageUrl); // Résoudre la promesse en cas de succès
        } else {
          console.log("Plusieurs images générées:", response);
          resolve(response);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Une erreur est survenue";
        setError(errorMessage);
        reject(errorMessage); // Rejeter la promesse en cas d'erreur
      } finally {
        setIsGenerating(false);
      }
    });

    // Utiliser toast.promise pour gérer les états
    toast.promise(promise, {
      loading: "Génération de votre image...",
      success: <b>Image générée avec succès !</b>,
      error: <b>La génération a échoué.</b>,
    });
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
      {/* Affichage des crédits */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCreditCard className="text-blue-600 text-xl" />
            <span className="text-sm font-medium text-blue-900">
              Crédits disponibles
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingCredits ? (
              <div className="animate-pulse bg-blue-200 h-6 w-12 rounded"></div>
            ) : (
              <>
                <span className="text-2xl font-bold text-blue-600">
                  {userCredits}
                </span>
                <span className="text-sm text-blue-700">crédits</span>
              </>
            )}
          </div>
        </div>
        {userCredits <= 0 && (
          <div className="mt-2 text-sm text-red-600">
            Vous n&apos;avez plus de crédits.{" "}
            <button
              onClick={() => router.push("/pricing")}
              className="text-blue-600 hover:underline font-medium"
            >
              Acheter des crédits
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <div className="flex items-center gap-2">
            <BiImageAlt className="text-xl" />
            <span>Décrivez votre image</span>
          </div>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Un lac paisible au coucher de soleil avec des montagnes en arrière-plan..."
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
            {isGenerating ? "Génération..." : "Générer"}
          </button>
        </div>

        {/* Paramètres avancés */}
        <div className="mt-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {showAdvanced ? "Afficher" : "Masquer"} les paramètres avancés
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={advancedSettings.width}
                  onChange={(e) =>
                    setAdvancedSettings({
                      ...advancedSettings,
                      width: parseInt(e.target.value) || 1024,
                    })
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  min="256"
                  max="2048"
                  step="64"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={advancedSettings.height}
                  onChange={(e) =>
                    setAdvancedSettings({
                      ...advancedSettings,
                      height: parseInt(e.target.value) || 1024,
                    })
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  min="256"
                  max="2048"
                  step="64"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Steps
                </label>
                <input
                  type="number"
                  value={advancedSettings.steps}
                  onChange={(e) =>
                    setAdvancedSettings({
                      ...advancedSettings,
                      steps: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  min="10"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  CFG Scale
                </label>
                <input
                  type="number"
                  value={advancedSettings.cfgScale}
                  onChange={(e) =>
                    setAdvancedSettings({
                      ...advancedSettings,
                      cfgScale: parseFloat(e.target.value) || 7,
                    })
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                  min="1"
                  max="20"
                  step="0.5"
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {isGenerating && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Création de votre chef-d&apos;œuvre et sauvegarde en cours...
          </p>
        </div>
      )}

      {generatedImage && !isGenerating && (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={generatedImage}
              alt="Image générée"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.open(generatedImage, "_blank");
                  toast.success("Téléchargement lancé !");
                }}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>Télécharger</span>
                <FiDownload className="text-lg" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <FiSave className="text-lg" />
              <span>Sauvegardé automatiquement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
