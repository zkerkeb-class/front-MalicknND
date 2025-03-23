import Image from "next/image";
import React from "react";

const GridImages = () => {
  const images = [
    {
      src: "https://cdn.pixabay.com/photo/2023/07/19/03/18/people-8135977_1280.png",
      alt: "Generated image 1",
    },
    {
      src: "https://cdn.pixabay.com/photo/2023/01/08/22/08/ai-generated-7706228_1280.jpg",
      alt: "Generated image 2",
    },
    {
      src: "https://cdn.pixabay.com/photo/2024/06/08/04/19/ai-generated-8815780_1280.jpg",
      alt: "Generated image 3",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 mb-16">
      {images.map((image, index) => (
        <div key={index} className="aspect-square rounded-lg overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default GridImages;
