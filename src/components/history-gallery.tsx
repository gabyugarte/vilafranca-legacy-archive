import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = {
  image_url: string;
  title?: string | null;
  caption?: string | null;
};

type HistoryGalleryProps = {
  images: (string | GalleryImage)[];
  title?: string;
};

export function HistoryGallery({
  images,
  title,
}: HistoryGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const normalizedImages: GalleryImage[] = images.map((image) =>
    typeof image === "string"
      ? { image_url: image }
      : image,
  );

  const previousImage = () => {
    if (selected === null) return;

    setSelected(
      selected === 0
        ? normalizedImages.length - 1
        : selected - 1,
    );
  };

  const nextImage = () => {
    if (selected === null) return;

    setSelected(
      selected === normalizedImages.length - 1
        ? 0
        : selected + 1,
    );
  };

  const selectedImage =
    selected !== null ? normalizedImages[selected] : null;

  return (
    <div className="mt-10">
      {title && (
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {title}
        </h4>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {normalizedImages.map((image, index) => (
          <div
            key={`${image.image_url}-${index}`}
            className="overflow-hidden rounded-2xl bg-card shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={image.image_url}
              loading="lazy"
              alt={
                image.title ??
                title ??
                "Historia del Barrio Vilafranca"
              }
              onClick={() => setSelected(index)}
              className="h-64 w-full cursor-pointer object-cover transition duration-500 hover:scale-105"
            />

            {(image.title || image.caption) && (
              <div className="p-4">
                {image.title && (
                  <h3 className="font-semibold text-foreground">
                    {image.title}
                  </h3>
                )}

                {image.caption && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {image.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setSelected(null)}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setSelected(null)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>

          {/* Flecha izquierda */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              previousImage();
            }}
            className="absolute left-6 rounded-full bg-white/10 p-4 text-white transition hover:bg-white/20"
            aria-label="Fotografía anterior"
          >
            <ChevronLeft size={34} />
          </button>

          <div
            className="flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={
                selectedImage.title ??
                title ??
                "Historia del Barrio Vilafranca"
              }
              className="max-h-[75vh] max-w-[90vw] rounded-2xl shadow-2xl"
            />

            {(selectedImage.title || selectedImage.caption) && (
              <div className="mt-4 max-w-3xl text-center text-white">
                {selectedImage.title && (
                  <h3 className="text-lg font-semibold">
                    {selectedImage.title}
                  </h3>
                )}

                {selectedImage.caption && (
                  <p className="mt-1 text-sm leading-relaxed text-white/80">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Flecha derecha */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 rounded-full bg-white/10 p-4 text-white transition hover:bg-white/20"
            aria-label="Fotografía siguiente"
          >
            <ChevronRight size={34} />
          </button>
        </div>
      )}
    </div>
  );
}