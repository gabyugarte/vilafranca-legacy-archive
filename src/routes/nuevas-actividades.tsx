import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { eventsQuery, CATEGORY_LABELS } from "@/lib/queries.functions";
import { Sparkles, Heart } from "lucide-react";

export const Route = createFileRoute("/nuevas-actividades")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  head: () => ({
    meta: [
      { title: "Seguimos escribiendo la historia — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Nuevas actividades, capítulos recientes y aportaciones vivas del Barrio Vilafranca.",
      },
      {
        property: "og:title",
        content: "Seguimos escribiendo — Barrio Vilafranca",
      },
      {
        property: "og:description",
        content: "Nuevos capítulos y actividades recientes del Barrio Vilafranca.",
      },
    ],
  }),
  component: NewActivitiesPage,
});

function NewActivitiesPage() {
  const { data: events } = useSuspenseQuery(eventsQuery);
  const currentYear = new Date().getFullYear();
  const recent = events
    .filter((e) => e.is_new_chapter || e.year >= currentYear - 2)
    .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));

  return (
    <>
      <PageHeader
        eyebrow="Un archivo vivo"
        title="Seguimos escribiendo la historia"
        description="La historia del Barrio Vilafranca no ha terminado. Cada domingo, cada actividad y cada testimonio suma un nuevo capítulo."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-border warm-gradient p-8 shadow-soft sm:p-12">
          <Sparkles className="h-6 w-6 text-warm-foreground" />
          <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
            ¿Tienes algo que compartir?
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/80">
            Fotografías de una actividad reciente, el testimonio de una
            experiencia especial, un nuevo llamamiento, un bautismo, una
            conferencia… Todo tiene su lugar en este archivo.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
            <Mail className="h-4 w-4" />
            Contacta con el coordinador del archivo del barrio
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-2xl text-foreground">
            Capítulos recientes
          </h3>
          {recent.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Todavía no hay capítulos recientes registrados.
            </div>
          ) : (
            <ol className="mt-6 space-y-4">
              {recent.map((e) => (
                <li
                  key={e.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-xl text-foreground">
                      {e.title}
                    </h4>
                    <time className="text-sm text-muted-foreground">
                      {new Date(e.event_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="mt-1 inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                    {CATEGORY_LABELS[e.category] ?? e.category}
                  </div>
                  {e.description && (
                    <p className="mt-2 text-sm text-foreground/80">
                      {e.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
