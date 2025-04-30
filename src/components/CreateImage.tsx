import Image from "next/image";
import React from "react";

const CreateImage = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-2">Create AI Images</h2>
      <p className="text-gray-600 mb-12">Turn your imagination into visuals</p>

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
            Introducing the AI-Powered Text to Image Generator
          </h3>
          <p className="text-gray-600 mb-4">
            Easily bring your ideas to life with our free AI image generator.
            Whether you need stunning visuals or unique imagery, our tool
            transforms your text into eye-catching images with just a few
            clicks.
          </p>
          <p className="text-gray-600">
            Simply type in a text prompt, and our cutting-edge AI will generate
            high-quality images in seconds. From concept to reality, the
            creative possibilities are limitless!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateImage;
