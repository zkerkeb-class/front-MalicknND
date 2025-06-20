import Image from "next/image";
import React from "react";

const CreateImage = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-2">Créez des images IA</h2>
      <p className="text-gray-600 mb-12">
        Transformez votre imagination en visuels
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-lg overflow-hidden">
          <Image
            src="https://cdn.pixabay.com/photo/2023/07/19/03/18/people-8135977_1280.png"
            alt="AI Image Generation Demo"
            width={500}
            height={500}
            className="w-full"
          />
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-bold mb-4">
            Découvrez le générateur d&apos;images IA à partir de texte
          </h3>
          <p className="text-gray-600 mb-4">
            Donnez vie à vos idées avec notre générateur d&apos;images IA
            gratuit. Que vous ayez besoin de visuels époustouflants ou
            d&apos;illustrations uniques, notre outil transforme votre texte en
            images en quelques clics.
          </p>
          <p className="text-gray-600">
            Saisissez simplement une description, et notre IA de pointe générera
            des images de haute qualité en quelques secondes. Du concept à la
            réalité, les possibilités créatives sont infinies !
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateImage;
