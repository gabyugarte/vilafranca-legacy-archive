import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Calendar, Tag } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { eventsQuery, CATEGORY_LABELS } from "@/lib/queries.functions";

export const Route = createFileRoute("/linea-tiempo")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  head: () => ({
    meta: [
      { title: "Línea del Tiempo — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Cronología interactiva de los principales hitos, actividades y momentos del Barrio Vilafranca.",
      },
      { property: "og:title", content: "Línea del Tiempo — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Cronología interactiva de la historia del Barrio Vilafranca.",
      },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const { data: events } = useSuspenseQuery(eventsQuery);
  const [q, setQ] = useState("");
  const [year, setYear] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const years = useMemo(
    () => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => a - b),
    [events],
  );
  const categories = useMemo(
    () => Array.from(new Set(events.map((e) => e.category))),
    [events],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return events.filter((e) => {
      if (year !== "all" && String(e.year) !== year) return false;
      if (category !== "all" && e.category !== category) return false;
      if (!term) return true;
      return (
        e.title.toLowerCase().includes(term) ||
        (e.description ?? "").toLowerCase().includes(term) ||
        (e.testimony ?? "").toLowerCase().includes(term)
      );
    });
  }, [events, q, year, category]);

  return (
    <>
      <PageHeader
        eyebrow="Cronología"
        title="Línea del tiempo del barrio"
        description="Recorre los momentos que han marcado nuestra historia. Filtra por año o por categoría, o busca un evento concreto."
      />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:grid-cols-[1fr_auto_auto]">
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar en la historia…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <label className="relative flex items-center">
            <Calendar className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-background py-2.5 pl-9 pr-8 text-sm outline-none focus:border-primary"
            >
              <option value="all">Todos los años</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="relative flex items-center">
            <Tag className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-background py-2.5 pl-9 pr-8 text-sm outline-none focus:border-primary"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c] ?? c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {filtered.length} de {events.length} eventos
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No hay eventos que coincidan con tu búsqueda todavía.
          </div>
        ) : (
          <ol className="relative space-y-4 border-l border-border pl-6 sm:pl-10">
            {filtered.map((e) => (
              <li key={e.id} className="relative animate-fade-in">
                <span className="absolute -left-[29px] top-4 grid h-4 w-4 place-items-center rounded-full border-2 border-background bg-primary sm:-left-[45px]" />
                <article className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl text-foreground">
                      {e.title}
                    </h3>
                    <time className="text-sm text-muted-foreground">
                      {new Date(e.event_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="mt-1 inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                    {CATEGORY_LABELS[e.category] ?? e.category}
                  </div>
                  {e.description && (
                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                      {e.description}
                    </p>
                  )}
                  {e.testimony && (
                    <blockquote className="mt-4 border-l-2 border-warm pl-4 text-sm italic text-foreground/75">
                      "{e.testimony}"
                    </blockquote>
                  )}
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
