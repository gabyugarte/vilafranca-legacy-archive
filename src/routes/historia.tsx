import { createFileRoute } from "@tanstack/react-router";
// import { PageHeader } from "@/components/page-header";
// import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { history } from "@/content/history";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Nuestra Historia — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Los orígenes, el crecimiento y el legado espiritual del Barrio Vilafranca de La Iglesia de Jesucristo de los Santos de los Últimos Días.",
      },
      { property: "og:title", content: "Nuestra Historia — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "El origen y el legado del Barrio Vilafranca.",
      },
    ],
  }),
  component: HistoriaPage,
});

function HistoriaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nuestra historia"
        title={history.title}
        description={history.subtitle}
      />

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-2xl italic text-muted-foreground">
            "{history.quote.text}"
          </p>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            {history.quote.reference}
          </p>
        </div>

{history.chapters.map((chapter) => (
  <section
    key={chapter.id}
    className="mx-auto mt-20 max-w-5xl"
  >
    {/* Imagen del capítulo */}
    <img
      src={chapter.image}
      alt={chapter.subtitle}
      className="mb-10 h-[420px] w-full rounded-3xl object-cover shadow-xl"
    />

    {/* Número del capítulo */}
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
      {chapter.title}
    </p>

    {/* Título */}
    <h2 className="mt-2 font-display text-5xl text-foreground">
      {chapter.subtitle}
    </h2>

    {/* Cita */}
    <blockquote className="mt-8 rounded-2xl border-l-4 border-primary bg-muted/40 p-8 italic text-xl text-muted-foreground">
      "{chapter.quote}"
    </blockquote>
    <div className="mt-12 space-y-16">
      {chapter.sections.map((section, index) => (
        <section key={index}>
          <h3 className="font-display text-3xl text-foreground">
            {section.title}
          </h3>

      <div className="mt-5 whitespace-pre-line text-lg leading-9 text-foreground/90">
        {section.content}
      </div>
    </section>
  ))}
</div>

  </section>
))}
      </article>
    </>
  );
}