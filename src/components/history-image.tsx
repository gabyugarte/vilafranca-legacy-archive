import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type HistoryImageProps = {
  src: string;
  alt: string;
};

export function HistoryImage({
  src,
  alt,
}: HistoryImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onClick={() => setOpen(true)}
        className="h-[420px] w-full cursor-pointer rounded-3xl object-cover shadow-xl transition duration-500 hover:scale-[1.01]"
      />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <X size={28} />
          </button>

          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}