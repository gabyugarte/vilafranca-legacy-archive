import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { history } from "@/content/history";
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

    return chapters ?? [];
  },
);

const historyQuery = {
  queryKey: ["history"],
  queryFn: () => fetchHistory(),
};

export const Route = createFileRoute("/historia/")({
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

      <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-2xl italic text-muted-foreground">
            "{history.quote.text}"
          </p>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            {history.quote.reference}
          </p>
        </div>

        {chapters.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Todavía no hay capítulos históricos publicados.
          </div>
        ) : (
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to="/historia/capitulo/$chapterId"
                params={{
                  chapterId: chapter.id,
                }}
                className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {chapter.cover_image && (
                  <div className="overflow-hidden">
                    <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                      <HistoryImage
                        src={chapter.cover_image}
                        alt={
                          chapter.subtitle ??
                          chapter.title
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                    {chapter.title}
                  </p>

                  {chapter.subtitle && (
                    <h2 className="mt-3 font-display text-3xl text-foreground">
                      {chapter.subtitle}
                    </h2>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      Leer capítulo
                    </span>

                    <span className="text-xl text-primary transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </article>
    </>
  );
}