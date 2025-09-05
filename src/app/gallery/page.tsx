import SavedImages from "@/components/SavedImages";

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Galerie d&apos;images
          </h1>
          <p className="text-lg text-gray-600">
            Visualisez et gérez toutes vos images sauvegardées
          </p>
        </div>

        <SavedImages />
      </main>
    </div>
  );
}
