import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { pioneersQuery } from "@/lib/queries.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/pioneros")({
  loader: ({ context }) => context.queryClient.ensureQueryData(pioneersQuery),
  head: () => ({
    meta: [
      { title: "Pioneros del Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Reconocimiento a los pioneros y familias que fundaron y sostuvieron el Barrio Vilafranca.",
      },
      { property: "og:title", content: "Pioneros — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Reconocimiento a los pioneros del Barrio Vilafranca.",
      },
    ],
  }),
  component: PioneersPage,
});

function PioneersPage() {
  const { data: pioneers } = useSuspenseQuery(pioneersQuery);

  return (
    <>
      <PageHeader
        eyebrow="Reconocimiento"
        title="Pioneros del barrio"
        description="Con gratitud honramos a las personas y familias que edificaron los cimientos espirituales del Barrio Vilafranca."
      />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {pioneers.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-border warm-gradient p-6 shadow-soft"
            >
              <Sparkles className="h-5 w-5 text-warm-foreground" />
              <h3 className="mt-3 font-display text-2xl text-foreground">
                {p.name}
              </h3>
              {p.years && (
                <p className="text-sm text-muted-foreground">{p.years}</p>
              )}
              {p.tribute && (
                <p className="mt-3 leading-relaxed text-foreground/90">
                  {p.tribute}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
