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
            Transformez vos idées en{" "}
            <span className="text-blue-500">images</span> & objets imprimés.
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Créez des visuels uniques avec l&apos;IA, puis imprimez-les sur de
            vrais produits avec Printify – de l&apos;imagination à la réalité en
            quelques clics.
          </p>
          <Link
            href="/generate"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 inline-flex items-center"
          >
            Générer une image
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
