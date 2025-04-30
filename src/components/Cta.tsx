import Link from "next/link";
import React from "react";

const Cta = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8">See the magic. Try now</h2>
      <Link
        href="/generate"
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 inline-flex items-center"
      >
        Generate Images
        <span className="ml-2">✨</span>
      </Link>
    </section>
  );
};

export default Cta;
