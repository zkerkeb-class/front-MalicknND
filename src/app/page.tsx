import CreateImage from "@/components/CreateImage";
import Cta from "@/components/Cta";
import GridImages from "@/components/GridImages";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">
            Turn text to <span className="text-blue-500">image</span>, in
            seconds.
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Unleash your creativity with AI. Turn your imagination into visual
            art in seconds - just type, and watch the magic happen.
          </p>
          <Link
            href="/generate"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 inline-flex items-center"
          >
            Generate Images
            <span className="ml-2">✨</span>
          </Link>
        </div>

        {/* Generated Images Grid */}
        <GridImages />
        {/* How it Works Section */}
        <HowItWorks />
        {/* Create AI Images Section */}
        <CreateImage />
        {/* Testimonials Section */}
        <Testimonials />
        {/* CTA Section */}
        <Cta />
      </main>
    </div>
  );
}
