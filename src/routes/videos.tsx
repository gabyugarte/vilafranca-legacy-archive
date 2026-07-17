import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { interviewsQuery } from "@/lib/queries.functions";
import { PlayCircle } from "lucide-react";

export const Route = createFileRoute("/videos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(interviewsQuery),
  head: () => ({
    meta: [
      { title: "Entrevistas y Vídeos — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Entrevistas y vídeos con miembros del Barrio Vilafranca que comparten su historia y testimonio.",
      },
      { property: "og:title", content: "Entrevistas — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Vídeos y entrevistas del Barrio Vilafranca.",
      },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { data: items } = useSuspenseQuery(interviewsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Voces del barrio"
        title="Entrevistas y vídeos"
        description="Testimonios grabados y conversaciones con miembros del barrio. Recuerdos que se ven y se escuchan."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border p-10 text-center">
            <PlayCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl text-foreground">
              Todavía no hay entrevistas publicadas
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Estamos preparando este espacio para preservar entrevistas en vídeo con
              miembros y ex-miembros del barrio.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((i) => (
              <a
                key={i.id}
                href={i.video_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="relative aspect-video bg-muted">
                  {i.thumbnail_url ? (
                    <img
                      src={i.thumbnail_url}
                      alt={i.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <PlayCircle className="h-12 w-12 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/30">
                    <PlayCircle className="h-14 w-14 text-white opacity-0 transition group-hover:opacity-100" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-foreground">
                    {i.title}
                  </h3>
                  {i.person && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Con {i.person}
                    </p>
                  )}
                  {i.summary && (
                    <p className="mt-2 text-sm text-foreground/80">{i.summary}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
