import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { storiesQuery } from "@/lib/queries.functions";
import { Quote } from "lucide-react";

export const Route = createFileRoute("/historias")({
  loader: ({ context }) => context.queryClient.ensureQueryData(storiesQuery),
  head: () => ({
    meta: [
      { title: "Historias de Fe — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Testimonios y experiencias espirituales de los miembros del Barrio Vilafranca.",
      },
      { property: "og:title", content: "Historias de Fe — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Testimonios de los miembros del Barrio Vilafranca.",
      },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const { data: stories } = useSuspenseQuery(storiesQuery);

  return (
    <>
      <PageHeader
        eyebrow="Testimonios"
        title="Historias de fe"
        description="Momentos que nos han cambiado. Cada testimonio es una piedra viva en la historia del barrio."
      />
      <section className="mx-auto max-w-4xl space-y-6 px-4 py-16 sm:px-6">
        {stories.map((s) => (
          <article
            key={s.id}
            className="rounded-2xl border border-border bg-card p-8 shadow-soft"
          >
            <Quote className="h-6 w-6 text-warm" />
            <h2 className="mt-3 font-display text-2xl text-foreground">
              {s.title}
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/90">{s.story}</p>
            <footer className="mt-6 text-sm text-muted-foreground">
              — {s.author}
              {s.event_date && (
                <span className="ml-2">
                  · {new Date(s.event_date).getFullYear()}
                </span>
              )}
            </footer>
          </article>
        ))}
      </section>
    </>
  );
}
