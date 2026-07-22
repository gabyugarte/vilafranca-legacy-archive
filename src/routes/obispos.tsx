import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { bishopsQuery } from "@/lib/queries.functions";
import { UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/obispos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(bishopsQuery),
  head: () => ({
    meta: [
      { title: "Obispos — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Árbol de liderazgo del Barrio Vilafranca con los obispos y su período de servicio.",
      },
      { property: "og:title", content: "Obispos — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Los obispos que han servido al Barrio Vilafranca.",
      },
    ],
  }),
  component: BishopsPage,
});

function fmt(date: string | null, fallback: string) {
  if (!date) return fallback;
  return new Date(date).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}

function BishopsPage() {
  const { data: bishops } = useSuspenseQuery(bishopsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Liderazgo"
        title="Árbol de obispos"
        description="Cada obispo ha guiado al barrio en un tiempo concreto, con amor y dedicación. Aquí honramos su servicio."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <ol className="relative space-y-6 border-l-2 border-border/60 pl-8">
          {bishops.map((b) => (
            <li key={b.id} className="relative">
              <span className="absolute -left-[41px] top-3 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-warm text-warm-foreground">
                <UserCircle2 className="h-4 w-4" />
              </span>
              <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl text-foreground">
                    {b.name}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {b.start_date || b.end_date
                      ? `${fmt(b.start_date, "—")} — ${fmt(b.end_date, "presente")}`
                      : "Fechas por confirmar"}
                  </div>
                </div>
                {b.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                    {b.bio}
                  </p>
                )}
                {(b.counselor_1 || b.counselor_2) && (
                  <div className="mt-4 grid gap-2 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground sm:grid-cols-2">
                    {b.counselor_1 && (
                      <div>
                        <span className="text-xs uppercase tracking-wider">
                          Primer consejero
                        </span>
                        <div className="text-foreground">{b.counselor_1}</div>
                      </div>
                    )}
                    {b.counselor_2 && (
                      <div>
                        <span className="text-xs uppercase tracking-wider">
                          Segundo consejero
                        </span>
                        <div className="text-foreground">{b.counselor_2}</div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
