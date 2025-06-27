import React, { useState, useEffect } from "react";
import { printifyService } from "@/services/printify";

interface PrintifyProductCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageFile?: File; // Optionnel : si tu veux uploader le fichier, sinon juste l'URL
  onProductCreated?: (product: any) => void;
}

const PrintifyProductCreator: React.FC<PrintifyProductCreatorProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageFile,
  onProductCreated,
}) => {
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);

  const [selectedBlueprint, setSelectedBlueprint] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(25.99);
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      printifyService
        .getBlueprints()
        .then(setBlueprints)
        .catch(() => setError("Erreur chargement produits"));
      printifyService
        .getShops()
        .then((shops) => {
          setShops(shops);
          if (shops && shops.length > 0) setSelectedShop(shops[0]);
        })
        .catch(() => setError("Erreur chargement boutiques"));
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedBlueprint) {
      printifyService
        .getPrintProviders(selectedBlueprint.id)
        .then(setProviders)
        .catch(() => setError("Erreur chargement fournisseurs"));
      setSelectedProvider(null);
      setSelectedVariants([]);
    }
  }, [selectedBlueprint]);

  useEffect(() => {
    if (selectedProvider && selectedBlueprint) {
      printifyService
        .getVariants(selectedBlueprint.id, selectedProvider.id)
        .then(setVariants)
        .catch(() => setError("Erreur chargement variantes"));
      setSelectedVariants([]);
    }
  }, [selectedProvider, selectedBlueprint]);

  useEffect(() => {
    if (imageFile && isOpen) {
      uploadImage();
    } else if (imageUrl && isOpen && !uploadedImageId && !imageFile) {
      setIsUploading(true);
      setError(null);
      printifyService
        .uploadImageFromUrl(imageUrl)
        .then((data) => {
          setUploadedImageId(data.id);
          setSuccess("Image uploadée sur Printify !");
          setError(null);
        })
        .catch(() => setError("Erreur lors de l'upload de l'image"))
        .finally(() => setIsUploading(false));
    }
    // eslint-disable-next-line
  }, [imageFile, imageUrl, isOpen]);

  useEffect(() => {
    if (uploadedImageId) {
      setError(null);
    }
  }, [uploadedImageId]);

  const uploadImage = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    setError(null);
    try {
      const data = await printifyService.uploadImage(imageFile);
      setUploadedImageId(data.id);
      setSuccess("Image uploadée avec succès !");
      setError(null);
    } catch (e) {
      setError("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const createProduct = async () => {
    console.log("Créer produit cliqué", {
      uploadedImageId,
      selectedVariants,
      selectedBlueprint,
      selectedProvider,
    });
    setError(null);
    if (!uploadedImageId) {
      setError(
        "L'image doit être uploadée sur Printify avant de créer le produit."
      );
      return;
    }
    if (
      !selectedBlueprint ||
      !selectedProvider ||
      selectedVariants.length === 0
    ) {
      setError("Veuillez remplir tous les champs requis");
      return;
    }
    setIsCreating(true);
    try {
      const productData = {
        title: productTitle || `${selectedBlueprint.title} personnalisé`,
        description:
          productDescription || `Produit personnalisé avec votre image`,
        imageId: uploadedImageId,
        price: productPrice,
        blueprint_id: selectedBlueprint.id,
        print_provider_id: selectedProvider.id,
        selected_variants: selectedVariants.map((v) => v.id),
      };
      const product = await printifyService.createProduct(productData);
      setSuccess("Produit créé avec succès sur Printify !");
      if (onProductCreated) onProductCreated(product);
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 2000);
    } catch (e) {
      setError("Erreur lors de la création du produit");
    } finally {
      setIsCreating(false);
    }
  };

  const handleVariantToggle = (variant: any) => {
    setError(null);
    setSelectedVariants((prev) => {
      const isSelected = prev.find((v) => String(v.id) === String(variant.id));
      if (isSelected) {
        return prev.filter((v) => String(v.id) !== String(variant.id));
      } else {
        return [...prev, variant];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Créer un produit Printify</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        {imageUrl && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Image sélectionnée :</h3>
            <img
              src={imageUrl}
              alt="Selected"
              className="w-32 h-32 object-cover rounded"
            />
            {isUploading && (
              <p className="text-blue-600 mt-2">Upload en cours...</p>
            )}
            {uploadedImageId && (
              <p className="text-green-600 mt-2">✓ Image uploadée</p>
            )}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Type de produit *
              </label>
              <select
                value={selectedBlueprint?.id || ""}
                onChange={(e) => {
                  setError(null);
                  setSelectedBlueprint(
                    blueprints.find((b) => b.id === parseInt(e.target.value))
                  );
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un produit</option>
                {blueprints.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedBlueprint && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Fournisseur d'impression *
                </label>
                <select
                  value={selectedProvider?.id || ""}
                  onChange={(e) => {
                    setError(null);
                    setSelectedProvider(
                      providers.find((p) => p.id === parseInt(e.target.value))
                    );
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Sélectionnez un fournisseur</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedProvider &&
              Array.isArray(variants) &&
              variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. Variantes disponibles * (sélectionnez au moins une)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {variants.map((variant) => (
                      <label
                        key={variant.id}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedVariants.some(
                            (v) => v.id === variant.id
                          )}
                          onChange={() => handleVariantToggle(variant)}
                          className="mr-2"
                        />
                        <span className="text-sm">{variant.title}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedVariants.length} variante(s) sélectionnée(s)
                  </p>
                </div>
              )}
          </div>
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4. Titre du produit
              </label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => {
                  setError(null);
                  setProductTitle(e.target.value);
                }}
                placeholder="Ex: Mon T-shirt Personnalisé"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => {
                  setError(null);
                  setProductDescription(e.target.value);
                }}
                placeholder="Description de votre produit..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => {
                  setError(null);
                  setProductPrice(parseFloat(e.target.value));
                }}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {shops.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  5. Boutique
                </label>
                <select
                  value={selectedShop?.id || ""}
                  onChange={(e) => {
                    setError(null);
                    setSelectedShop(
                      shops.find((s) => s.id === parseInt(e.target.value))
                    );
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={createProduct}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isCreating ? "Création en cours..." : "Créer le produit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintifyProductCreator;
