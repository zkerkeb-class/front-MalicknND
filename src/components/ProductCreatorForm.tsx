"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiArrowLeft, FiCheck, FiLoader } from "react-icons/fi";
import {
  printifyService,
  Blueprint,
  Provider,
  Variant,
  ProductCreationData,
} from "@/services/printifyService";

interface ProductCreatorFormProps {
  selectedImage: {
    id: string;
    url: string;
    title: string;
    width: number;
    height: number;
  };
  onProductCreated: (productId: string) => void;
  onCancel: () => void;
}

export default function ProductCreatorForm({
  selectedImage,
  onProductCreated,
  onCancel,
}: ProductCreatorFormProps) {
  // États pour les données du formulaire
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // États pour les sélections de l'utilisateur
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(
    null
  );
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // États pour les détails du produit
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // États de chargement et d'erreur
  const [loading, setLoading] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les blueprints au montage du composant
  useEffect(() => {
    loadBlueprints();
  }, []);

  // Initialiser le titre et la description avec l'image sélectionnée
  useEffect(() => {
    if (selectedImage && !productTitle) {
      setProductTitle(`Produit ${selectedImage.title}`);
      setProductDescription(
        `Produit personnalisé créé à partir de: ${selectedImage.title}`
      );
    }
  }, [selectedImage, productTitle]);

  const loadBlueprints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await printifyService.getBlueprints();
      setBlueprints(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des produits disponibles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlueprintSelect = async (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setSelectedProvider(null);
    setProviders([]);
    setVariants([]);
    setSelectedVariants([]);
    setSelectedColors([]);

    try {
      setLoadingProviders(true);
      const response = await printifyService.getProviders(blueprint.id);
      setProviders(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des fournisseurs");
      console.error(err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleProviderSelect = async (provider: Provider) => {
    if (!selectedBlueprint) return;

    setSelectedProvider(provider);
    setVariants([]);
    setSelectedVariants([]);
    setSelectedColors([]);

    try {
      setLoadingVariants(true);
      const response = await printifyService.getVariants(
        selectedBlueprint.id,
        provider.id
      );
      setVariants(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des variants");
      console.error(err);
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleColorSelect = (color: string) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newSelectedColors);

    // Mettre à jour les variants sélectionnés en fonction des couleurs
    const newSelectedVariants = variants
      .filter((v) => newSelectedColors.includes(v.color) && v.isAvailable)
      .map((v) => v.id);

    setSelectedVariants(newSelectedVariants);
  };

  const handleSizeSelect = (variantId: number, color: string) => {
    if (selectedVariants.includes(variantId)) {
      setSelectedVariants((prev) => prev.filter((id) => id !== variantId));
    } else {
      setSelectedVariants((prev) => [...prev, variantId]);
    }
  };

  const handleCreateProduct = async () => {
    if (
      !selectedBlueprint ||
      !selectedProvider ||
      selectedVariants.length === 0
    ) {
      setError(
        "Veuillez sélectionner un produit, un fournisseur et au moins une variante"
      );
      return;
    }

    if (!productTitle.trim()) {
      setError("Veuillez saisir un titre pour le produit");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const productData: ProductCreationData = {
        title: productTitle.trim(),
        description: productDescription.trim() || productTitle.trim(),
        imageUrl: selectedImage.url,
        blueprintId: selectedBlueprint.id,
        printProviderId: selectedProvider.id,
        variantIds: selectedVariants,
      };

      const response = await printifyService.createProduct(productData);

      if (response.success) {
        onProductCreated(response.data.id);
      } else {
        throw new Error("Erreur lors de la création du produit");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // Grouper les variants par couleur
  const variantsByColor = printifyService.groupVariantsByColor(variants);
  const availableColors = Object.keys(variantsByColor);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            Chargement des produits disponibles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft />
              <span>Retour</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Créer un produit personnalisé
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Image et détails */}
          <div className="space-y-6">
            {/* Aperçu de l'image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Votre image</h2>
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {selectedImage.title}
              </p>
            </div>

            {/* Détails du produit */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Détails du produit</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du produit *
                  </label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Mon T-shirt personnalisé"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description de votre produit..."
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colonne du milieu - Configuration du produit */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sélection du type de produit */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">
                1. Choisissez le type de produit
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blueprints.map((blueprint) => (
                  <button
                    key={blueprint.id}
                    onClick={() => handleBlueprintSelect(blueprint)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedBlueprint?.id === blueprint.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {blueprint.images[0] && (
                      <div className="aspect-square relative mb-3 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={blueprint.images[0]}
                          alt={blueprint.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-gray-900">
                      {blueprint.title}
                    </h3>
                    <p className="text-sm text-gray-500">{blueprint.brand}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {blueprint.model}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sélection du fournisseur */}
            {selectedBlueprint && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">
                  2. Choisissez le fournisseur
                </h2>
                {loadingProviders ? (
                  <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-2xl text-blue-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedProvider?.id === provider.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <h3 className="font-medium text-gray-900">
                          {provider.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {provider.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sélection des couleurs et tailles */}
            {selectedProvider && variants.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">
                  3. Choisissez les couleurs et tailles
                </h2>
                {loadingVariants ? (
                  <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-2xl text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sélection des couleurs */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Couleurs disponibles
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedColors.includes(color)
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sélection des tailles par couleur */}
                    {selectedColors.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">
                          Tailles par couleur
                        </h3>
                        <div className="space-y-4">
                          {selectedColors.map((color) => (
                            <div
                              key={color}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h4 className="font-medium text-gray-800 mb-3">
                                {color}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {variantsByColor[color]
                                  .filter((v) => v.isAvailable)
                                  .map((variant) => (
                                    <button
                                      key={variant.id}
                                      onClick={() =>
                                        handleSizeSelect(variant.id, color)
                                      }
                                      className={`px-3 py-2 rounded-md text-sm border-2 transition-all ${
                                        selectedVariants.includes(variant.id)
                                          ? "border-green-500 bg-green-50 text-green-700"
                                          : "border-gray-200 hover:border-gray-300"
                                      }`}
                                    >
                                      {variant.size}
                                      {selectedVariants.includes(
                                        variant.id
                                      ) && <FiCheck className="inline ml-1" />}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Résumé des sélections */}
                    {selectedVariants.length > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">
                          <strong>{selectedVariants.length}</strong> variante(s)
                          sélectionnée(s)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bouton de création */}
            {selectedVariants.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Prêt à créer votre produit ?
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedVariants.length} variante(s) ×{" "}
                      {selectedBlueprint?.title}
                    </p>
                  </div>
                  <button
                    onClick={handleCreateProduct}
                    disabled={creating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {creating ? (
                      <>
                        <FiLoader className="animate-spin" />
                        <span>Création...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        <span>Créer le produit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
