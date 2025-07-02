"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  description: string;
}

const PricingPage = () => {
  const { user } = useUser();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setIsLoading(true);
      const creditPackages = await paymentService.getCreditPackages();
      setPackages(creditPackages);
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("Erreur lors du chargement des packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (creditPackage: CreditPackage) => {
    if (!user?.id) {
      toast.error("Vous devez être connecté pour acheter des crédits");
      return;
    }

    try {
      setSelectedPackage(creditPackage.id);
      const session = await paymentService.createPaymentSession(
        user.id,
        creditPackage.id
      );
      window.location.href = session.url;
    } catch (error) {
      console.error("Error creating payment session:", error);
      toast.error("Erreur lors de la création de la session de paiement");
      setSelectedPackage(null);
    }
  };

  // Placeholder for the icon - replace with actual icon component or SVG if available
  const IconPlaceholder = () => (
    <div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm mb-4">
            NOS OFFRES
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choisissez votre offre
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {isLoading
            ? // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-md mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-32 mb-6"></div>
                  <div className="h-8 bg-gray-300 rounded w-20 mb-8"></div>
                  <div className="h-12 bg-gray-300 rounded w-full"></div>
                </div>
              ))
            : packages.map((creditPackage) => (
                <div
                  key={creditPackage.id}
                  className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100"
                >
                  <IconPlaceholder />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {creditPackage.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 h-8">
                    {creditPackage.description}
                  </p>
                  <div className="flex items-baseline justify-center mb-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {creditPackage.price}€
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      / {creditPackage.credits} crédits
                    </span>
                  </div>
                  <div className="h-8 mb-8"></div>
                  <button
                    onClick={() => handlePurchase(creditPackage)}
                    disabled={selectedPackage === creditPackage.id}
                    className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {selectedPackage === creditPackage.id
                      ? "Redirection..."
                      : "Acheter"}
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
