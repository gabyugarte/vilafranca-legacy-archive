import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { organizationsQuery } from "@/lib/queries.functions";

export const Route = createFileRoute("/organizaciones/")({
      loader: ({ context }) =>
    context.queryClient.ensureQueryData(organizationsQuery),
  head: () => ({
    meta: [
      { title: "Organizaciones del Barrio — Vilafranca" },
      {
        name: "description",
        content:
          "Conoce la historia y la información de las organizaciones del Barrio Vilafranca.",
      },
      { property: "og:title", content: "Organizaciones — Barrio Vilafranca" },
      {
        property: "og:description",
        content:
          "Conoce la historia de las organizaciones que forman parte del Barrio Vilafranca.",
      },
    ],
  }),
  component: OrgsPage,
});

function OrgsPage() {
  const { data: orgs } = useSuspenseQuery(organizationsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Auxiliares y cuórums"
        title="Organizaciones del barrio"
        description="Cada organización forma parte de la historia y de la vida del Barrio Vilafranca. Aquí puedes conocer su propósito, su historia y los recuerdos que forman parte de ella."
      />

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
        {orgs.map((o) => (
          <Link
            key={o.id}
            to="/organizaciones/$slug"
            params={{ slug: o.slug }}
            className="group"
          >
            <article className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              {o.photo_url && (
                <div className="mb-6 overflow-hidden rounded-xl">
                  <img
                    src={o.photo_url}
                    alt={o.name}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <h2 className="font-display text-3xl text-foreground transition-colors group-hover:text-primary">
                {o.name}
              </h2>

              {o.short_description && (
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {o.short_description}
                </p>
              )}

              <div className="mt-6 text-sm font-medium text-primary">
                Ver historia y recuerdos →
              </div>
            </article>
          </Link>
        ))}
      </section>
    </>
  );
}