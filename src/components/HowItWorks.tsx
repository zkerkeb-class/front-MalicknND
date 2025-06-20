import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-2">Comment ça marche</h2>
      <p className="text-gray-600 mb-12">
        Transformez vos mots en créations visuelles et objets imprimés
      </p>

      <div className="grid gap-8 max-w-2xl mx-auto">
        <div className="flex items-start gap-4 text-left">
          <div className="bg-blue-100 p-3 rounded-lg">
            <span role="img" aria-label="vision" className="text-2xl">
              👁️
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Décrivez votre idée</h3>
            <p className="text-gray-600">
              Saisissez une phrase, une description ou un concept : notre IA
              générera une image unique à partir de votre texte.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-left">
          <div className="bg-purple-100 p-3 rounded-lg">
            <span role="img" aria-label="magic" className="text-2xl">
              ✨
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Admirez la magie</h3>
            <p className="text-gray-600">
              Notre moteur IA transforme instantanément votre texte en une image
              originale et de haute qualité.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-left">
          <div className="bg-green-100 p-3 rounded-lg">
            <span role="img" aria-label="download" className="text-2xl">
              ⬇️
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Imprimez & partagez</h3>
            <p className="text-gray-600">
              Sélectionnez un produit et imprimez votre création via Printify,
              ou partagez-la avec le monde.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
