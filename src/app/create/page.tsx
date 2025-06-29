"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Upload,
  Package,
  Palette,
  DollarSign,
  Check,
  ArrowLeft,
} from "lucide-react";

// Données simulées pour les produits Printify
const PRODUCT_CATALOG = {
  tshirt: {
    name: "T-shirt Premium",
    basePrice: 12.5,
    variants: {
      S: { price: 12.5, colors: ["Blanc", "Noir", "Gris", "Marine"] },
      M: { price: 12.5, colors: ["Blanc", "Noir", "Gris", "Marine"] },
      L: { price: 13.0, colors: ["Blanc", "Noir", "Gris", "Marine"] },
      XL: { price: 13.5, colors: ["Blanc", "Noir", "Gris", "Marine"] },
      XXL: { price: 14.0, colors: ["Blanc", "Noir", "Gris", "Marine"] },
    },
    suppliers: ["Printify Choice", "Monster Digital", "Gooten"],
  },
  mug: {
    name: "Mug Céramique",
    basePrice: 8.75,
    variants: {
      "11oz": { price: 8.75, colors: ["Blanc", "Noir"] },
      "15oz": { price: 9.25, colors: ["Blanc", "Noir"] },
    },
    suppliers: ["Printify Choice", "SPOKE Custom Products"],
  },
  totebag: {
    name: "Tote Bag Canvas",
    basePrice: 9.5,
    variants: {
      Standard: { price: 9.5, colors: ["Naturel", "Noir", "Marine"] },
    },
    suppliers: ["Printify Choice", "Gooten"],
  },
  hoodie: {
    name: "Sweat à Capuche",
    basePrice: 25.0,
    variants: {
      S: { price: 25.0, colors: ["Blanc", "Noir", "Gris"] },
      M: { price: 25.0, colors: ["Blanc", "Noir", "Gris"] },
      L: { price: 26.0, colors: ["Blanc", "Noir", "Gris"] },
      XL: { price: 27.0, colors: ["Blanc", "Noir", "Gris"] },
      XXL: { price: 28.0, colors: ["Blanc", "Noir", "Gris"] },
    },
    suppliers: ["Printify Choice", "Monster Digital"],
  },
};

// Images d'exemple de la galerie IA
const AI_GALLERY = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
    title: "Paysage Fantastique",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    title: "Montagne Abstraite",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2ac5?w=300&h=300&fit=crop",
    title: "Art Numérique",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop",
    title: "Design Moderne",
  },
];

const CustomProductCreator = () => {
  const [currentView, setCurrentView] = useState("gallery");
  const [selectedImage, setSelectedImage] = useState(null);
  const [productForm, setProductForm] = useState({
    productType: "",
    supplier: "",
    size: "",
    color: "",
    productName: "",
    description: "",
    customMargin: 40, // Marge par défaut de 40%
  });
  const [finalPrice, setFinalPrice] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [productCreated, setProductCreated] = useState(false);

  // Calculer le prix final avec marge
  useEffect(() => {
    if (productForm.productType && productForm.size) {
      const product = PRODUCT_CATALOG[productForm.productType];
      if (product && product.variants[productForm.size]) {
        const basePrice = product.variants[productForm.size].price;
        const priceWithMargin =
          basePrice * (1 + productForm.customMargin / 100);
        setFinalPrice(priceWithMargin);
      }
    }
  }, [productForm]);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setCurrentView("productForm");
  };

  const handleFormChange = (field, value) => {
    setProductForm((prev) => {
      const newForm = { ...prev, [field]: value };

      // Reset des champs dépendants
      if (field === "productType") {
        newForm.supplier = "";
        newForm.size = "";
        newForm.color = "";
      } else if (field === "size") {
        newForm.color = "";
      }

      return newForm;
    });
  };

  const handleCreateProduct = async () => {
    setIsCreating(true);

    // Simulation de l'appel API vers le microservice Printify
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsCreating(false);
    setProductCreated(true);
    setCurrentView("confirmation");
  };

  const resetForm = () => {
    setCurrentView("gallery");
    setSelectedImage(null);
    setProductForm({
      productType: "",
      supplier: "",
      size: "",
      color: "",
      productName: "",
      description: "",
      customMargin: 40,
    });
    setFinalPrice(0);
    setProductCreated(false);
  };

  // Vue Galerie
  if (currentView === "gallery") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ma Galerie IA
          </h1>
          <p className="text-gray-600">
            Sélectionnez une image pour créer votre produit personnalisé
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_GALLERY.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {image.title}
                </h3>
                <button
                  onClick={() => handleImageSelect(image)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Créer un produit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vue Formulaire de création
  if (currentView === "productForm") {
    const selectedProduct = productForm.productType
      ? PRODUCT_CATALOG[productForm.productType]
      : null;
    const availableSizes = selectedProduct
      ? Object.keys(selectedProduct.variants)
      : [];
    const availableColors =
      selectedProduct && productForm.size
        ? selectedProduct.variants[productForm.size].colors
        : [];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView("gallery")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la galerie
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer votre produit personnalisé
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Aperçu de l'image */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-900 mb-3">
                Image sélectionnée
              </h3>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-64 object-cover rounded-md"
              />
              <p className="text-sm text-gray-600 mt-2">
                {selectedImage.title}
              </p>
            </div>

            {finalPrice > 0 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-800">Prix final</h3>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {finalPrice.toFixed(2)} €
                </p>
                <p className="text-sm text-green-600">
                  Frais de production et livraison inclus
                </p>
              </div>
            )}
          </div>

          {/* Formulaire */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-900 mb-4">
                Configuration du produit
              </h3>

              {/* Type de produit */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de produit
                </label>
                <select
                  value={productForm.productType}
                  onChange={(e) =>
                    handleFormChange("productType", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un produit</option>
                  <option value="tshirt">T-shirt Premium</option>
                  <option value="mug">Mug Céramique</option>
                  <option value="totebag">Tote Bag Canvas</option>
                  <option value="hoodie">Sweat à Capuche</option>
                </select>
              </div>

              {/* Fournisseur */}
              {productForm.productType && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fournisseur
                  </label>
                  <select
                    value={productForm.supplier}
                    onChange={(e) =>
                      handleFormChange("supplier", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un fournisseur</option>
                    {selectedProduct.suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Taille */}
              {productForm.productType && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille
                  </label>
                  <select
                    value={productForm.size}
                    onChange={(e) => handleFormChange("size", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une taille</option>
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Couleur */}
              {productForm.size && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur
                  </label>
                  <select
                    value={productForm.color}
                    onChange={(e) => handleFormChange("color", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une couleur</option>
                    {availableColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nom du produit */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={productForm.productName}
                  onChange={(e) =>
                    handleFormChange("productName", e.target.value)
                  }
                  placeholder="Ex: Mon T-shirt artistique"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  placeholder="Décrivez votre produit..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bouton de création */}
              <button
                onClick={handleCreateProduct}
                disabled={
                  !productForm.productType ||
                  !productForm.supplier ||
                  !productForm.size ||
                  !productForm.color ||
                  !productForm.productName ||
                  isCreating
                }
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Créer le produit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue Confirmation
  if (currentView === "confirmation") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produit créé avec succès !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre produit personnalisé a été ajouté à votre boutique Printify
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Produit</p>
                <p className="font-medium">
                  {PRODUCT_CATALOG[productForm.productType]?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taille</p>
                <p className="font-medium">{productForm.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Couleur</p>
                <p className="font-medium">{productForm.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prix</p>
                <p className="font-medium text-green-600">
                  {finalPrice.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => alert("Redirection vers la boutique...")}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Voir le produit dans ma boutique
            </button>
            <button
              onClick={resetForm}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Créer un autre produit
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default CustomProductCreator;
