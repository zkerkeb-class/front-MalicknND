"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingCart,
  Palette,
  Database,
  Bell,
  CreditCard,
  CheckCircle,
  Zap,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Génération d'Images IA",
      description:
        "Créez des images uniques avec l'IA Stable Diffusion 3.5. Transformez vos idées en visuels époustouflants en quelques secondes.",
      highlights: [
        "Prompts textuels avancés",
        "Résolutions personnalisables",
        "Styles artistiques multiples",
        "Génération en temps réel",
      ],
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
      emoji: "✨",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Print-on-Demand",
      description:
        "Vendez vos créations sur des produits physiques avec l'intégration Printify. De l'idée à la vente en quelques clics.",
      highlights: [
        "Catalogue de produits variés",
        "Intégration Printify complète",
        "Gestion des commandes",
        "Calcul automatique des marges",
      ],
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      emoji: "🛍️",
    },
    {
      icon: Palette,
      title: "Créateur de Produits",
      description:
        "Personnalisez vos images sur différents supports : t-shirts, mugs, tote bags, et bien plus encore.",
      highlights: [
        "Interface drag & drop",
        "Prévisualisation en temps réel",
        "Personnalisation avancée",
        "Export haute qualité",
      ],
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      emoji: "🎨",
    },
    {
      icon: Database,
      title: "Gestion de Base de Données",
      description:
        "Stockage sécurisé de vos créations avec Prisma. Accédez à vos images depuis n'importe où.",
      highlights: [
        "Stockage cloud sécurisé",
        "Synchronisation automatique",
        "Historique complet",
        "Sauvegarde automatique",
      ],
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
      emoji: "💾",
    },
    {
      icon: Bell,
      title: "Système de Notifications",
      description:
        "Restez informé de vos commandes et nouveautés avec notre système de notifications par email.",
      highlights: [
        "Notifications en temps réel",
        "Emails personnalisés",
        "Webhooks Clerk intégrés",
        "Gestion des préférences",
      ],
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      emoji: "🔔",
    },
    {
      icon: CreditCard,
      title: "Paiements Sécurisés",
      description:
        "Achetez des crédits et gérez vos paiements en toute sécurité avec Stripe.",
      highlights: [
        "Paiements Stripe sécurisés",
        "Gestion des crédits",
        "Historique des transactions",
        "Support multi-devises",
      ],
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      emoji: "💳",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Rapidité",
      description: "Génération d'images en quelques secondes",
      emoji: "⚡",
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Données protégées et paiements sécurisés",
      emoji: "🛡️",
    },
    {
      icon: Globe,
      title: "Accessibilité",
      description: "Disponible 24/7 depuis n'importe où",
      emoji: "🌐",
    },
    {
      icon: Smartphone,
      title: "Responsive",
      description: "Interface adaptée à tous les écrans",
      emoji: "📱",
    },
  ];

  const workflow = [
    {
      step: "1",
      title: "Décrivez votre idée",
      description:
        "Saisissez une phrase, une description ou un concept : notre IA générera une image unique à partir de votre texte.",
      emoji: "👁️",
      color: "bg-blue-100",
    },
    {
      step: "2",
      title: "Admirez la magie",
      description:
        "Notre moteur IA transforme instantanément votre texte en une image originale et de haute qualité.",
      emoji: "✨",
      color: "bg-purple-100",
    },
    {
      step: "3",
      title: "Personnalisez",
      description:
        "Adaptez votre création aux différents produits et supports disponibles.",
      emoji: "🎨",
      color: "bg-green-100",
    },
    {
      step: "4",
      title: "Vendez & partagez",
      description:
        "Sélectionnez un produit et imprimez votre création via Printify, ou partagez-la avec le monde.",
      emoji: "🛍️",
      color: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 px-4">
            Découvrez toutes nos{" "}
            <span className="text-blue-500">fonctionnalités</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4 max-w-3xl mx-auto">
            Imagink combine IA, e-commerce et créativité pour vous offrir une
            plateforme complète de création et de vente de produits
            personnalisés.
          </p>
          <Link
            href="/generate"
            className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-800 inline-flex items-center text-sm sm:text-base"
          >
            Commencer maintenant
            <span className="ml-2">✨</span>
          </Link>
        </section>

        {/* Features Grid - FULLY RESPONSIVE */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">
            Fonctionnalités principales
          </h2>
          <p className="text-gray-600 mb-8 sm:mb-12 text-center sm:text-left">
            Une suite complète d&apos;outils pour créer, personnaliser et vendre
            vos créations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 group border border-gray-100`}
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${feature.color} rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-1 sm:space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-xs sm:text-sm text-gray-700"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works Section - RESPONSIVE */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">
            Comment ça marche
          </h2>
          <p className="text-gray-600 mb-8 sm:mb-12 text-center sm:text-left">
            Un processus simple en 4 étapes pour transformer vos idées en
            business
          </p>

          <div className="grid gap-6 sm:gap-8 max-w-2xl mx-auto">
            {workflow.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 sm:gap-4 text-left"
              >
                <div
                  className={`${step.color} p-2 sm:p-3 rounded-lg flex-shrink-0`}
                >
                  <span
                    role="img"
                    aria-label={step.title}
                    className="text-xl sm:text-2xl"
                  >
                    {step.emoji}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold mb-1 sm:mb-2 text-base sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section - FULLY RESPONSIVE */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">
            Pourquoi choisir Imagink ?
          </h2>
          <p className="text-gray-600 mb-8 sm:mb-12 text-center sm:text-left">
            Une plateforme moderne conçue pour les créateurs et entrepreneurs
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section - RESPONSIVE */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left">
            Nos chiffres
          </h2>
          <p className="text-gray-600 mb-8 sm:mb-12 text-center sm:text-left">
            Imagink en quelques statistiques
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">
                10K+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Images générées
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">
                5K+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Produits créés
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">
                1K+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Utilisateurs actifs
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">
                99.9%
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                Disponibilité
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - RESPONSIVE */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 px-4">
            Prêt à commencer votre aventure créative ?
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 px-4 max-w-2xl mx-auto text-sm sm:text-base">
            Rejoignez des milliers de créateurs qui utilisent déjà Imagink pour
            transformer leurs idées en business.
          </p>
          <Link
            href="/generate"
            className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-800 inline-flex items-center text-sm sm:text-base"
          >
            Commencer maintenant
            <span className="ml-2">✨</span>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default FeaturesPage;
