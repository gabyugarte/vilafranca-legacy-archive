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
