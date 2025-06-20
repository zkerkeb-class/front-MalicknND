import React from "react";

const page = () => {
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

  const pricingPlans = [
    {
      name: "Basique",
      description: "Idéal pour un usage personnel.",
      price: "10€",
      credits: "/ 100 crédits",
    },
    {
      name: "Avancé",
      description: "Parfait pour un usage professionnel.",
      price: "50€",
      credits: "/ 500 crédits",
    },
    {
      name: "Entreprise",
      description: "Pour les besoins des entreprises.",
      price: "250€",
      credits: "/ 5000 crédits",
    },
  ];

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
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100"
            >
              <IconPlaceholder />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h2>
              <p className="text-sm text-gray-500 mb-6 h-8">
                {plan.description}
              </p>{" "}
              {/* Added fixed height for alignment */}
              <div className="flex items-baseline justify-center mb-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {plan.credits}
                </span>
              </div>
              {/* Added spacer for alignment */}
              <div className="h-8 mb-8"></div>
              <button className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Commencer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
