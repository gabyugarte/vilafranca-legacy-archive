import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import { HistoryChapter } from "@/components/history-chapter";
import type { Database } from "@/integrations/supabase/types";

const fetchChapter = createServerFn({ method: "GET" })
  .validator((data: { chapterId: string }) => data)
  .handler(async ({ data }) => {
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

    const { data: chapter, error: chapterError } =
      await supabase
        .from("history_chapters")
        .select("*")
        .eq("id", data.chapterId)
        .eq("status", "approved")
        .maybeSingle();

    if (chapterError) {
      throw new Error(chapterError.message);
    }

    if (!chapter) {
      return null;
    }

    const { data: blocks, error: blocksError } =
      await supabase
        .from("history_blocks")
        .select("*")
        .eq("chapter_id", data.chapterId)
        .order("order_index", { ascending: true });

    if (blocksError) {
      throw new Error(blocksError.message);
    }

    const { data: chapters, error: chaptersError } =
      await supabase
        .from("history_chapters")
        .select("id, title, subtitle, order_index")
        .eq("status", "approved")
        .order("order_index", { ascending: true });

    if (chaptersError) {
      throw new Error(chaptersError.message);
    }

    const currentIndex =
      chapters?.findIndex(
        (item) => item.id === data.chapterId,
      ) ?? -1;

    const previousChapter =
      currentIndex > 0
        ? chapters?.[currentIndex - 1]
        : null;

    const nextChapter =
      currentIndex >= 0 &&
      currentIndex < (chapters?.length ?? 0) - 1
        ? chapters?.[currentIndex + 1]
        : null;

    return {
      ...chapter,
      blocks: blocks ?? [],
      previousChapter,
      nextChapter,
    };
  });

const chapterQuery = (chapterId: string) => ({
  queryKey: ["history-chapter", chapterId],
  queryFn: () => fetchChapter({ data: { chapterId } }),
});

export const Route = createFileRoute(
  "/historia/capitulo/$chapterId",
)({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      chapterQuery(params.chapterId),
    ),

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.subtitle
          ? `${loaderData.subtitle} — Barrio Vilafranca`
          : `${loaderData?.title ?? "Historia"} — Barrio Vilafranca`,
      },
      {
        name: "description",
        content:
          loaderData?.subtitle ??
          "Historia del Barrio Vilafranca de La Iglesia de Jesucristo de los Santos de los Últimos Días.",
      },
    ],
  }),

  component: HistoriaChapterPage,
});

function HistoriaChapterPage() {
  const { chapterId } = Route.useParams();

  const { data: chapter } = useSuspenseQuery(
    chapterQuery(chapterId),
  );

  if (!chapter) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-foreground">
          Capítulo no encontrado
        </h1>

        <p className="mt-4 text-muted-foreground">
          El capítulo que buscas no está disponible.
        </p>

        <Link
          to="/historia"
          className="mt-8 inline-block text-primary underline"
        >
          ← Volver a nuestra historia
        </Link>
      </main>
    );
  }

  return (
    <>
      <div className="mx-auto flex max-w-5xl justify-between px-4 pt-8 sm:px-6">
        <Link
          to="/historia"
          className="text-sm font-medium text-primary transition hover:underline"
        >
          ← Todos los capítulos
        </Link>
      </div>

      <HistoryChapter chapter={chapter} />

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="border-t border-border pt-8">
          <Link
            to="/historia"
            className="text-sm font-medium text-primary transition hover:underline"
          >
            ← Volver a nuestra historia
          </Link>
        </div>
      </div>
    </>
  );
}