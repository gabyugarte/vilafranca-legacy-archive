import { Link } from "@tanstack/react-router";
import { HistoryGallery } from "@/components/history-gallery";
import { HistoryImage } from "@/components/history-image";

type HistoryBlock = {
  id: string;
  type: string;
  content: string | null;
  caption: string | null;
  order_index: number | null;
};

type HistoryChapter = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  cover_image: string | null;
  order_index: number | null;
  blocks: HistoryBlock[];
  previousChapter: {
    id: string;
    title: string;
    subtitle: string | null;
  } | null;
  nextChapter: {
    id: string;
    title: string;
    subtitle: string | null;
  } | null;
};

type HistoryChapterProps = {
  chapter: HistoryChapter;
};

export function HistoryChapter({ chapter }: HistoryChapterProps) {
  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6">

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
        <h1 className="mt-2 font-display text-5xl text-foreground">
          {chapter.subtitle}
        </h1>
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

          {/* Tarjetas / nombres */}
          if (
            block.type === "text" &&
            block.caption?.startsWith("card:")
          ) {
            const label = block.caption.replace("card:", "");

            return (
              <div
                key={block.id}
                className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm transition hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {label}
                </p>

                <p className="mt-2 text-xl font-semibold text-foreground">
                  {block.content}
                </p>
              </div>
            );
          }

          {/* Texto normal */}
if (block.type === "text") {
  return (
    <section key={block.id}>
      {block.caption && (
        <h2 className="mb-4 font-display text-3xl text-foreground">
          {block.caption}
        </h2>
      )}

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

          {/* Galería */}
{/* Galería */}
if (block.type === "gallery") {
  let images: string[] = [];
  let description = "";

  try {
    const parsed = JSON.parse(block.content ?? "[]");

    if (Array.isArray(parsed)) {
      // Formato antiguo
      images = parsed;
    } else if (parsed && typeof parsed === "object") {
      // Formato nuevo
      images = Array.isArray(parsed.images) ? parsed.images : [];
      description =
        typeof parsed.description === "string"
          ? parsed.description
          : "";
    }
  } catch {
    images = [];
    description = "";
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section key={block.id}>
      {block.caption && (
        <h2 className="mb-4 font-display text-3xl text-foreground">
          {block.caption}
        </h2>
      )}

      {description && (
        <p className="mb-6 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      )}

      <HistoryGallery
        images={images}
        title={block.caption ?? "Galería histórica"}
      />
    </section>
  );
}

          {/* Documento */}
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
                      {block.caption || "Documento histórico"}
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

          {/* Vídeo */}
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
                      {block.caption || "Vídeo histórico"}
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
            <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
        {chapter.previousChapter ? (
          <Link
            to="/historia/capitulo/$chapterId"
            params={{
              chapterId: chapter.previousChapter.id,
            }}
            className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              ← Capítulo anterior
            </p>

            <p className="mt-2 text-lg font-semibold text-foreground transition group-hover:text-primary">
              {chapter.previousChapter.title}
            </p>

            {chapter.previousChapter.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {chapter.previousChapter.subtitle}
              </p>
            )}
          </Link>
        ) : (
          <div />
        )}

        {chapter.nextChapter ? (
          <Link
            to="/historia/capitulo/$chapterId"
            params={{
              chapterId: chapter.nextChapter.id,
            }}
            className="group rounded-2xl border border-border bg-card p-5 text-right transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Siguiente capítulo →
            </p>

            <p className="mt-2 text-lg font-semibold text-foreground transition group-hover:text-primary">
              {chapter.nextChapter.title}
            </p>

            {chapter.nextChapter.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {chapter.nextChapter.subtitle}
              </p>
            )}
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}