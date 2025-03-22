import ImageGenerator from "@/components/ImageGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Générateur d&apos;Images avec Stability AI
          </h1>
          <p className="text-lg text-gray-600">
            Créez des images uniques à partir de descriptions textuelles
          </p>
        </div>
        <ImageGenerator />
      </div>
    </main>
  );
}
