import SavedImages from "@/components/SavedImages";

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Image Gallery
          </h1>
          <p className="text-lg text-gray-600">
            View and manage all your saved images
          </p>
        </div>

        <SavedImages />
      </main>
    </div>
  );
}
