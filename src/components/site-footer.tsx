import { useEffect, useState } from "react";

export function SiteFooter() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl text-foreground">Barrio Vilafranca</div>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Un museo digital dedicado a preservar la historia espiritual, cultural
              y humana del Barrio Vilafranca de La Iglesia de Jesucristo de los
              Santos de los Últimos Días.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              «Recordad, recordad»
            </div>
            <p className="mt-2 text-sm italic text-muted-foreground">
              «Y esto lo escribimos para que sepan que aún vivimos por Cristo».
            </p>
          </div>
<div className="text-sm text-muted-foreground md:text-right">
  <p>Un proyecto para las generaciones futuras.</p>

  <p className="mt-1">
    © {new Date().getFullYear()} Barrio Vilafranca. Todos los recuerdos
    pertenecen a sus miembros.
  </p>
<div className="mt-4 flex items-center justify-end gap-4">
    <span className="text-sm text-muted-foreground">
    Síguenos en nuestras redes
  </span>

  <div className="flex items-center gap-3">
    <a
      href="https://www.instagram.com/barriovilafrancasud/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram del Barrio Vilafranca"
      title="Instagram del Barrio Vilafranca"
      className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    </a>

    <a
      href="https://www.facebook.com/profile.php?id=61587525950635&locale=es_ES"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook del Barrio Vilafranca"
      title="Facebook del Barrio Vilafranca"
      className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.55.45-1 1-1z" />
      </svg>
    </a>
  </div>
</div>
  <p className="mt-2 text-xs">
    Sitio web desarrollado por{" "}
    <a
      href="https://gabyugarte.github.io/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-foreground transition-colors hover:text-primary"
    >
      Gabriela Ugarte M.
    </a>
  </p>
</div>
        </div>
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Volver al inicio"
          title="Volver al inicio"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          ↑
        </button>
      )}
    </footer>
  );
}
