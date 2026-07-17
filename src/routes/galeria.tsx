import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { galleryQuery } from "@/lib/queries.functions";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/galeria")({
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
  head: () => ({
    meta: [
      { title: "Galería Histórica — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Fotografías históricas del Barrio Vilafranca: actividades, retratos y momentos del barrio a lo largo de los años.",
      },
      { property: "og:title", content: "Galería Histórica — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Fotografías históricas del Barrio Vilafranca.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: photos } = useSuspenseQuery(galleryQuery);

  return (
    <>
      <PageHeader
        eyebrow="Galería"
        title="Fotografías históricas"
        description="Un archivo visual del barrio: rostros, actividades y espacios que ya forman parte de nuestra memoria común."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {photos.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border p-10 text-center">
            <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl text-foreground">
              La galería está esperando tus fotografías
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cuando se añadan fotografías al archivo del barrio, aparecerán aquí
              ordenadas por año y categoría.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photos.map((p) => (
              <figure
                key={p.id}
                className="mb-4 break-inside-avoid rounded-2xl border border-border bg-card p-2 shadow-soft"
              >
                <img
                  src={p.image_url}
                  alt={p.title ?? "Foto histórica"}
                  loading="lazy"
                  className="w-full rounded-xl object-cover"
                />
                {(p.title || p.caption) && (
                  <figcaption className="px-2 py-3 text-sm text-muted-foreground">
                    {p.title && (
                      <div className="font-medium text-foreground">{p.title}</div>
                    )}
                    {p.caption}
                    {p.year && (
                      <span className="ml-2 text-xs">· {p.year}</span>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
