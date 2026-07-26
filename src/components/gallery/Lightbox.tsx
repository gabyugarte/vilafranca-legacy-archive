import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type LightboxProps = {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
      >
        <X size={28} />
      </button>

      {/* Flecha izquierda */}
      <button
        onClick={onPrevious}
        className="absolute left-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
      >
        <ChevronLeft size={34} />
      </button>

      {/* Imagen */}
      <img
        src={images[currentIndex]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
      />

      {/* Flecha derecha */}
      <button
        onClick={onNext}
        className="absolute right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
      >
        <ChevronRight size={34} />
      </button>
    </div>
  );
}