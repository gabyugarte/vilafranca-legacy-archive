// import { createFileRoute } from "@tanstack/react-router";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { PageHeader } from "@/components/page-header";
// import { historyQuery } from "@/lib/queries.functions";
// import { history } from "@/content/history";
// import { HistoryGallery } from "@/components/history-gallery";
// import { HistoryImage } from "@/components/history-image";

// export const Route = createFileRoute("/historia")({
//   head: () => ({
//     meta: [
//       { title: "Nuestra Historia — Barrio Vilafranca" },
//       {
//         name: "description",
//         content:
//           "Los orígenes, el crecimiento y el legado espiritual del Barrio Vilafranca de La Iglesia de Jesucristo de los Santos de los Últimos Días.",
//       },
//       {
//         property: "og:title",
//         content: "Nuestra Historia — Barrio Vilafranca",
//       },
//       {
//         property: "og:description",
//         content: "El origen y el legado del Barrio Vilafranca.",
//       },
//     ],
//   }),
//   component: HistoriaPage,
// });

// function HistoriaPage() {
//   return (
//     <>
//       <PageHeader
//         eyebrow="Nuestra historia"
//         title={history.title}
//         description={history.subtitle}
//       />

//       <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
//         {/* Cita principal */}
//         <div className="mx-auto max-w-3xl">
//           <p className="text-center text-2xl italic text-muted-foreground">
//             "{history.quote.text}"
//           </p>

//           <p className="mt-2 text-center text-sm text-muted-foreground">
//             {history.quote.reference}
//           </p>
//         </div>

//         {/* Capítulos */}
//         {history.chapters.map((chapter) => (
//           <section
//             key={chapter.id}
//             className="mx-auto mt-20 max-w-5xl"
//           >
//             {/* Imagen */}
// <div className="mb-10">
//   <HistoryImage
//     src={chapter.image}
//     alt={chapter.subtitle}
//   />
// </div>

//             {/* Número del capítulo */}
//             <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
//               {chapter.title}
//             </p>

//             {/* Título */}
//             <h2 className="mt-2 font-display text-5xl text-foreground">
//               {chapter.subtitle}
//             </h2>

//             {/* Cita */}
//             <blockquote className="mt-8 rounded-2xl border-l-4 border-primary bg-muted/40 p-8 italic text-xl text-muted-foreground">
//               "{chapter.quote}"
//             </blockquote>

//             {/* Secciones */}
//             <div className="mt-12 space-y-16">
//               {chapter.sections.map((section, index) => (
//                 <section key={index}>
//                   {/* Línea decorativa */}
//                   <div className="mb-6 h-px w-24 bg-primary/40" />

//                   {/* Título */}
//                   <h3 className="font-display text-3xl text-foreground">
//                     {section.title}
//                   </h3>

//                   {(() => {
//                     const lines = section.content.trim().split("\n");
//                     const firstLine = lines[0].trim();

//                     const hasDate =
//                       /\d{4}/.test(firstLine) ||
//                       firstLine.includes("de") ||
//                       firstLine.includes("Octubre") ||
//                       firstLine.includes("noviembre") ||
//                       firstLine.includes("abril") ||
//                       firstLine.includes("junio");

//                     const body = hasDate
//                       ? lines.slice(1).join("\n")
//                       : section.content;

//                     return (
//                       <>
//                         {/* Fecha */}
//                         {hasDate && (
//                           <div className="mt-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
//                             {firstLine}
//                           </div>
//                         )}

//                         {/* Texto */}
//                         <div
//                           className={`mt-6 whitespace-pre-line text-lg leading-9 text-foreground/90 ${
//                             index === 0
//                               ? "first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-none first-letter:text-primary"
//                               : ""
//                           }`}
//                         >
//                           {body}
//                         </div>

//                         {/* Cards */}
//                         {section.cards && (
//                           <div className="mt-8 grid gap-4 md:grid-cols-2">
//                             {section.cards.map((card, i) => (
//                               <div
//                                 key={i}
//                                 className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm transition hover:shadow-lg"
//                               >
//                                 <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
//                                   {card.label}
//                                 </p>

//                                 <p className="mt-2 text-xl font-semibold text-foreground">
//                                   {card.value}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                         {/* Galería */}
// {section.gallery && (
//   <HistoryGallery
//     images={section.gallery}
//     title={section.title}
//   />
// )}
//                       </>
//                     );
//                   })()}
//                 </section>
//               ))}
//             </div>
//           </section>
//         ))}
//       </article>
//     </>
//   );
// }


import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { history } from "@/content/history";
import { HistoryGallery } from "@/components/history-gallery";
import { HistoryImage } from "@/components/history-image";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const fetchHistory = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { data: chapters, error: chaptersError } =
      await supabase
        .from("history_chapters")
        .select("*")
        .eq("status", "approved")
        .order("order_index", { ascending: true });

    if (chaptersError) {
      throw new Error(chaptersError.message);
    }

    if (!chapters || chapters.length === 0) {
      return [];
    }

    const chapterIds = chapters.map((chapter) => chapter.id);

    const { data: blocks, error: blocksError } =
      await supabase
        .from("history_blocks")
        .select("*")
        .in("chapter_id", chapterIds)
        .order("order_index", { ascending: true });

    if (blocksError) {
      throw new Error(blocksError.message);
    }

    return chapters.map((chapter) => ({
      ...chapter,
      blocks:
        blocks?.filter(
          (block) => block.chapter_id === chapter.id,
        ) ?? [],
    }));
  },
);

const historyQuery = {
  queryKey: ["history"],
  queryFn: () => fetchHistory(),
};

export const Route = createFileRoute("/historia")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(historyQuery),

  head: () => ({
    meta: [
      {
        title: "Nuestra Historia — Barrio Vilafranca",
      },
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
        content:
          "El origen y el legado del Barrio Vilafranca.",
      },
    ],
  }),

  component: HistoriaPage,
});

function HistoriaPage() {
  const { data: chapters } =
    useSuspenseQuery(historyQuery);

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

        {/* Capítulos desde Supabase */}
        {chapters.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Todavía no hay capítulos históricos publicados.
          </div>
        ) : (
          chapters.map((chapter) => (
            <section
              key={chapter.id}
              className="mx-auto mt-20 max-w-5xl"
            >

              {/* Imagen de portada */}
              {chapter.cover_image && (
                <div className="mb-10">
                  <HistoryImage
                    src={chapter.cover_image}
                    alt={chapter.subtitle ?? chapter.title}
                  />
                </div>
              )}

              {/* Número del capítulo */}
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                {chapter.title}
              </p>

              {/* Título */}
              {chapter.subtitle && (
                <h2 className="mt-2 font-display text-5xl text-foreground">
                  {chapter.subtitle}
                </h2>
              )}

              {/* Cita del capítulo */}
              {chapter.content && (
                <blockquote className="mt-8 rounded-2xl border-l-4 border-primary bg-muted/40 p-8 italic text-xl text-muted-foreground">
                  "{chapter.content}"
                </blockquote>
              )}

              {/* Bloques */}
              <div className="mt-12 space-y-16">

                {chapter.blocks.map((block, index) => {

                  if (block.type === "text") {
                    return (
                      <section key={block.id}>
                        <div className="mb-6 h-px w-24 bg-primary/40" />

                        <div
                          className={`whitespace-pre-line text-lg leading-9 text-foreground/90 ${
                            index === 0
                              ? "first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-none first-letter:text-primary"
                              : ""
                          }`}
                        >
                          {block.content}
                        </div>
                      </section>
                    );
                  }

                  if (block.type === "image") {
                    return (
                      <section key={block.id}>
                        <HistoryImage
                          src={block.content ?? ""}
                          alt={
                            block.caption ??
                            "Imagen histórica del Barrio Vilafranca"
                          }
                        />

                        {block.caption && (
                          <p className="mt-3 text-center text-sm italic text-muted-foreground">
                            {block.caption}
                          </p>
                        )}
                      </section>
                    );
                  }

                  if (block.type === "gallery") {
                    let images: string[] = [];

                    try {
                      images = JSON.parse(
                        block.content ?? "[]",
                      );
                    } catch {
                      images = [];
                    }

                    if (images.length === 0) {
                      return null;
                    }

                    return (
                      <section key={block.id}>
                        <HistoryGallery
                          images={images}
                          title={
                            block.caption ??
                            "Galería histórica"
                          }
                        />
                      </section>
                    );
                  }

                  if (block.type === "quote") {
                    return (
                      <section key={block.id}>
                        <blockquote className="rounded-2xl border-l-4 border-primary bg-muted/40 p-8 text-xl italic text-muted-foreground">
                          "{block.content}"
                        </blockquote>
                      </section>
                    );
                  }

                  if (block.type === "document") {
                    return (
                      <section
                        key={block.id}
                        className="rounded-2xl border border-border bg-card p-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            📄
                          </div>

                          <div>
                            <p className="font-semibold text-foreground">
                              Documento histórico
                            </p>

                            {block.content && (
                              <a
                                href={block.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-sm text-primary underline"
                              >
                                Abrir documento
                              </a>
                            )}
                          </div>
                        </div>
                      </section>
                    );
                  }

                  if (block.type === "video") {
                    return (
                      <section
                        key={block.id}
                        className="rounded-2xl border border-border bg-card p-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            🎥
                          </div>

                          <div>
                            <p className="font-semibold text-foreground">
                              Vídeo histórico
                            </p>

                            {block.content && (
                              <a
                                href={block.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-sm text-primary underline"
                              >
                                Ver vídeo
                              </a>
                            )}
                          </div>
                        </div>
                      </section>
                    );
                  }

                  return null;
                })}

              </div>
            </section>
          ))
        )}

      </article>
    </>
  );
}