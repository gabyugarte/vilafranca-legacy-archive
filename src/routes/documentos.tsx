import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { documentsQuery } from "@/lib/queries.functions";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/documentos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(documentsQuery),
  head: () => ({
    meta: [
      { title: "Documentos Históricos — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Documentos escaneados, programas, boletines y registros históricos del Barrio Vilafranca.",
      },
      { property: "og:title", content: "Documentos — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Archivo documental del Barrio Vilafranca.",
      },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const { data: docs } = useSuspenseQuery(documentsQuery);

  return (
    <>
      <PageHeader
        eyebrow="Archivo documental"
        title="Documentos históricos"
        description="Programas, boletines, cartas y registros que forman parte del archivo del barrio."
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {docs.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-display text-xl text-foreground">
              Aún no hay documentos digitalizados
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cuando se escaneen y añadan documentos al archivo, aparecerán en
              esta sección.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {docs.map((d) => (
              <li key={d.id}>
                <a
                  href={d.document_url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-soft"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl text-foreground group-hover:text-primary">
                      {d.title}
                    </div>
                    {d.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {d.description}
                      </p>
                    )}
                    {d.document_date && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(d.document_date).toLocaleDateString("es-ES")}
                      </p>
                    )}
                  </div>
                  <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
