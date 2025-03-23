import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-2">How it works</h2>
      <p className="text-gray-600 mb-12">
        Transform Words Into Stunning Images
      </p>

      <div className="grid gap-8 max-w-2xl mx-auto">
        <div className="flex items-start gap-4 text-left">
          <div className="bg-blue-100 p-3 rounded-lg">
            <span role="img" aria-label="vision" className="text-2xl">
              👁️
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Describe Your Vision</h3>
            <p className="text-gray-600">
              Type a phrase, sentence, or paragraph that describes the image you
              want to create.
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
            <h3 className="font-semibold mb-2">Watch the Magic</h3>
            <p className="text-gray-600">
              Our AI-powered engine will transform your text into a
              high-quality, unique image in seconds.
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
            <h3 className="font-semibold mb-2">Download & Share</h3>
            <p className="text-gray-600">
              Instantly download your creation or share it with the world
              directly from our platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
