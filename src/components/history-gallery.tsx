import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type HistoryGalleryProps = {
  images: string[];
  title?: string;
};

export function HistoryGallery({
  images,
  title,
}: HistoryGalleryProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const previousImage = () => {
  if (selected === null) return;

  setSelected(
    selected === 0
      ? images.length - 1
      : selected - 1
  );
};

const nextImage = () => {
  if (selected === null) return;

  setSelected(
    selected === images.length - 1
      ? 0
      : selected + 1
  );
};
  return (
    <div className="mt-10">
      {title && (
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {title}
        </h4>
      )}

<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {images.map((image, index) => (
    <div
      key={image}
      className="overflow-hidden rounded-2xl shadow-md transition duration-300 hover:shadow-xl"
    >
      <img
        src={image}
        loading="lazy"
        alt={title ?? "Historia del Barrio Vilafranca"}
        onClick={() => setSelected(index)}
        className="h-64 w-full cursor-pointer object-cover transition duration-500 hover:scale-105"
      />
    </div>
  ))}
</div>

{selected !== null && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
    onClick={() => setSelected(null)}
  >
    {/* Botón cerrar */}
    <button
      onClick={() => setSelected(null)}
      className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
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
    >
      <ChevronLeft size={34} />
    </button>

    {/* Imagen */}
    <img
      src={images[selected]}
      alt={title}
      className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />

    {/* Flecha derecha */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        nextImage();
      }}
      className="absolute right-6 rounded-full bg-white/10 p-4 text-white transition hover:bg-white/20"
    >
      <ChevronRight size={34} />
    </button>
  </div>
)}
    </div>
  );
}