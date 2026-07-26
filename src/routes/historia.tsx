import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { history } from "@/content/history";
import { HistoryGallery } from "@/components/history-gallery";
import { HistoryImage } from "@/components/history-image";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Nuestra Historia — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Los orígenes, el crecimiento y el legado espiritual del Barrio Vilafranca de La Iglesia de Jesucristo de los Santos de los Últimos Días.",
      },
      {
        property: "og:title",
        content: "Nuestra Historia — Barrio Vilafranca",
      },
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
        {/* Cita principal */}
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-2xl italic text-muted-foreground">
            "{history.quote.text}"
          </p>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            {history.quote.reference}
          </p>
        </div>

        {/* Capítulos */}
        {history.chapters.map((chapter) => (
          <section
            key={chapter.id}
            className="mx-auto mt-20 max-w-5xl"
          >
            {/* Imagen */}
<div className="mb-10">
  <HistoryImage
    src={chapter.image}
    alt={chapter.subtitle}
  />
</div>

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

            {/* Secciones */}
            <div className="mt-12 space-y-16">
              {chapter.sections.map((section, index) => (
                <section key={index}>
                  {/* Línea decorativa */}
                  <div className="mb-6 h-px w-24 bg-primary/40" />

                  {/* Título */}
                  <h3 className="font-display text-3xl text-foreground">
                    {section.title}
                  </h3>

                  {(() => {
                    const lines = section.content.trim().split("\n");
                    const firstLine = lines[0].trim();

                    const hasDate =
                      /\d{4}/.test(firstLine) ||
                      firstLine.includes("de") ||
                      firstLine.includes("Octubre") ||
                      firstLine.includes("noviembre") ||
                      firstLine.includes("abril") ||
                      firstLine.includes("junio");

                    const body = hasDate
                      ? lines.slice(1).join("\n")
                      : section.content;

                    return (
                      <>
                        {/* Fecha */}
                        {hasDate && (
                          <div className="mt-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                            {firstLine}
                          </div>
                        )}

                        {/* Texto */}
                        <div
                          className={`mt-6 whitespace-pre-line text-lg leading-9 text-foreground/90 ${
                            index === 0
                              ? "first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-none first-letter:text-primary"
                              : ""
                          }`}
                        >
                          {body}
                        </div>

                        {/* Cards */}
                        {section.cards && (
                          <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {section.cards.map((card, i) => (
                              <div
                                key={i}
                                className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm transition hover:shadow-lg"
                              >
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                  {card.label}
                                </p>

                                <p className="mt-2 text-xl font-semibold text-foreground">
                                  {card.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Galería */}
{section.gallery && (
  <HistoryGallery
    images={section.gallery}
    title={section.title}
  />
)}
                      </>
                    );
                  })()}
                </section>
              ))}
            </div>
          </section>
        ))}
      </article>
    </>
  );
}