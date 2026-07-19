import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Lock, Heart } from "lucide-react";
import { useSession } from "@/lib/use-session";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/historia", label: "Nuestra Historia" },
  { to: "/linea-tiempo", label: "Línea del Tiempo" },
  { to: "/obispos", label: "Obispos" },
  { to: "/organizaciones", label: "Organizaciones" },
  { to: "/galeria", label: "Galería" },
  { to: "/historias", label: "Historias de Fe" },
  { to: "/documentos", label: "Documentos" },
  { to: "/videos", label: "Entrevistas" },
  { to: "/pioneros", label: "Pioneros" },
  { to: "/nuevas-actividades", label: "Seguimos escribiendo" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full warm-gradient">
            <span className="font-display text-xl text-primary">V</span>
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-lg text-foreground sm:text-xl">
              Barrio Vilafranca
            </div>
            <div className="truncate text-xs text-muted-foreground">
              Museo digital · Historia y legado
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV.slice(0, 8).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                to="/aportar"
                className="hidden items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs text-primary-foreground shadow-soft transition hover:opacity-90 sm:inline-flex"
              >
                <Heart className="h-3.5 w-3.5" /> Aportar
              </Link>
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
              >
                <Lock className="h-3.5 w-3.5" /> Admin
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
            >
              <Lock className="h-3.5 w-3.5" /> Acceso
            </Link>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border xl:hidden"
            aria-label="Abrir menú"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:grid-cols-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
