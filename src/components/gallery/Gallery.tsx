import { useState } from "react";
import { Lightbox } from "./Lightbox";

type GalleryProps = {
  images: string[];
  title?: string;
  columns?: 1 | 2 | 3;
};

export function Gallery({
  images,
  title,
  columns = 3,
}: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const next = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const previous = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + images.length) % images.length
    );
  };

  const gridClass =
    columns === 1
      ? "grid grid-cols-1"
      : columns === 2
      ? "grid gap-5 sm:grid-cols-2"
      : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={gridClass}>
        {images.map((image, index) => (
 <div
  key={image}
  className={
    columns === 1
      ? "overflow-hidden rounded-3xl"
      : "overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl"
  }
>
            <img
              src={image}
              loading="lazy"
              alt={title ?? ""}
              onClick={() => setSelectedIndex(index)}
className={
  columns === 1
    ? "aspect-[4/3] w-full cursor-pointer rounded-3xl object-cover shadow-elegant transition duration-500 hover:scale-105"
    : "h-64 w-full cursor-pointer object-cover transition duration-500 hover:scale-105"
}            />
          </div>
        ))}
      </div>

      <Lightbox
        images={images}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onNext={next}
        onPrevious={previous}
      />
    </>
  );
}