import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Users, Heart, Camera, FileText, PlayCircle } from "lucide-react";
import { Gallery } from "@/components/gallery";

//import chapelHero from "@/assets/chapel-vilafranca.jpg.asset.json";
const chapelHero = "/images/chapel-vilafranca.jpeg";
import {
  eventsQuery,
  organizationsQuery,
  bishopsQuery,
  branchPresidentsQuery,
  CATEGORY_LABELS,
} from "@/lib/queries.functions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(eventsQuery),
      context.queryClient.ensureQueryData(organizationsQuery),
      context.queryClient.ensureQueryData(bishopsQuery),
      context.queryClient.ensureQueryData(branchPresidentsQuery),
    ]);
  },
  head: () => ({
    meta: [
      {
        property: "og:image",
        content:
          "https://id-preview--c1be1213-ce06-4414-9b30-4eb70a970faa.lovable.app/chapel-hero.jpg",
      },
    ],
  }),
  component: Home,
});

const sections = [
  { to: "/historia", label: "Nuestra Historia", icon: BookOpen },
  { to: "/linea-tiempo", label: "Línea del Tiempo", icon: ArrowRight },
  { to: "/obispos", label: "Obispos", icon: Users },
  { to: "/organizaciones", label: "Organizaciones", icon: Users },
  { to: "/galeria", label: "Galería Histórica", icon: Camera },
  { to: "/historias", label: "Historias de Fe", icon: Heart },
  { to: "/documentos", label: "Documentos", icon: FileText },
  { to: "/videos", label: "Entrevistas y Vídeos", icon: PlayCircle },
] as const;

function Home() {
  const { data: events } = useSuspenseQuery(eventsQuery);
  const { data: orgs } = useSuspenseQuery(organizationsQuery);
  const { data: bishops } = useSuspenseQuery(bishopsQuery);
  const { data: branchPresidents } = useSuspenseQuery(branchPresidentsQuery);

  const highlights = events.slice(0, 6);
  const firstYear = events[0]?.year ?? new Date().getFullYear();
  const years = new Date().getFullYear() - 1979;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Museo Digital del Barrio Vilafranca
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Historia del{" "}
              <em className="italic text-primary">Barrio Vilafranca</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Un lugar tranquilo para recordar, honrar y preservar el legado
              espiritual y humano de nuestra comunidad de La Iglesia de Jesucristo
              de los Santos de los Últimos Días. Cada nombre, cada historia y
              cada domingo cuentan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/linea-tiempo"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95"
              >
                Recorrer la línea del tiempo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/historia"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Leer nuestra historia
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Años
                </dt>
                <dd className="mt-1 font-display text-3xl text-foreground">
                  {years > 0 ? years : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Presidentes de rama
                </dt>
                <dd className="mt-1 font-display text-3xl text-foreground">
                  7
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Obispos
                </dt>
                <dd className="mt-1 font-display text-3xl text-foreground">
                  {bishops.length}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Hitos
                </dt>
                <dd className="mt-1 font-display text-3xl text-foreground">
                  {events.length}
                </dd>
              </div>
            </dl>
          </div>

<div className="relative">
  <div className="absolute -inset-4 rounded-3xl warm-gradient blur-2xl opacity-60 pointer-events-none" />

<Gallery
  images={[chapelHero]}
  title="Capilla del Barrio Vilafranca"
  columns={1}
/>

  <figcaption className="mt-3 text-center text-xs italic text-muted-foreground">
    Nuestra capilla — hogar espiritual del barrio
  </figcaption>
</div>
</div>

      </section>

      {/* Welcome */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary">Bienvenidos</div>
        <p className="mt-6 font-display text-3xl leading-snug text-foreground sm:text-4xl">
          «Y esto lo escribimos para que sepan las generaciones venideras…»
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
          Esta web es un archivo vivo. Aquí guardamos las fotografías, los
          testimonios, los llamamientos, las conferencias, los campamentos y los
          pequeños milagros que han hecho del Barrio Vilafranca una familia en
          el Evangelio.
        </p>
      </section>

      {/* Sections grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg text-foreground">{label}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  Explorar <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline preview */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary">
                Línea del tiempo
              </div>
              <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
                Hitos que nos definen
              </h2>
            </div>
            <Link
              to="/linea-tiempo"
              className="story-link text-sm font-medium text-primary"
            >
              Ver toda la historia →
            </Link>
          </div>

          <ol className="mt-12 space-y-6">
            {highlights.map((event, idx) => (
              <li
                key={event.id}
                className="relative grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-[120px_1fr] sm:gap-8"
              >
                <div>
                  <div className="font-display text-4xl text-primary">
                    {event.year}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {CATEGORY_LABELS[event.category] ?? event.category}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-foreground">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                  {event.testimony && (
                    <blockquote className="mt-4 border-l-2 border-warm pl-4 text-sm italic text-foreground/80">
                      "{event.testimony}"
                    </blockquote>
                  )}
                </div>
                {idx < highlights.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-full h-6 w-px bg-border sm:left-16"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Organizations preview */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-primary">
            Organizaciones del barrio
          </div>
          <h2 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
            Servicio en cada rincón
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link
              key={org.id}
              to="/organizaciones"
              hash={org.slug}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-soft"
            >
              <div className="font-display text-2xl text-foreground group-hover:text-primary">
                {org.name}
              </div>
              {org.short_description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {org.short_description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Closing invite */}
      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <div className="rounded-3xl border border-border warm-gradient p-10 shadow-soft sm:p-14">
          <div className="text-xs uppercase tracking-[0.25em] text-warm-foreground">
            Seguimos escribiendo la historia
          </div>
          <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Tu recuerdo también forma parte
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Comparte una fotografía, un testimonio, un llamamiento o una actividad
            reciente. Cada aportación se convierte en herencia para los que vendrán.
          </p>
          <Link
            to="/nuevas-actividades"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Añadir un nuevo capítulo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
