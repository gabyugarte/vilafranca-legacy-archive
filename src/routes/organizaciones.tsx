import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { organizationsQuery } from "@/lib/queries.functions";

export const Route = createFileRoute("/organizaciones")({
  loader: ({ context }) => context.queryClient.ensureQueryData(organizationsQuery),
  head: () => ({
    meta: [
      { title: "Organizaciones del Barrio — Vilafranca" },
      {
        name: "description",
        content:
          "Sociedad de Socorro, Primaria, Hombres Jóvenes, Mujeres Jóvenes, Escuela Dominical y Cuórum de Élderes del Barrio Vilafranca.",
      },
      { property: "og:title", content: "Organizaciones — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Las auxiliares y cuórums que dan vida al Barrio Vilafranca.",
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
        description="Cada organización es una comunidad dentro de la comunidad. Aquí conocemos su historia, su presente y a quienes las dirigen."
      />

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-16 sm:px-6">
        {orgs.map((o) => (
          <article
            key={o.id}
            id={o.slug}
            className="scroll-mt-24 rounded-2xl border border-border bg-card p-8 shadow-soft"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-3xl text-foreground">{o.name}</h2>
              {o.current_leader && (
                <div className="text-sm text-muted-foreground">
                  Dirige actualmente:{" "}
                  <span className="text-foreground">{o.current_leader}</span>
                </div>
              )}
            </header>
            {o.short_description && (
              <p className="mt-2 text-base text-muted-foreground">
                {o.short_description}
              </p>
            )}
            {o.history && (
              <p className="mt-4 leading-relaxed text-foreground/90">
                {o.history}
              </p>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
