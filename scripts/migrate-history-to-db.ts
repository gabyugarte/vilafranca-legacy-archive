/**
 * Herramienta local (no se importa desde el frontend).
 * Lee src/content/history.ts y genera SQL idempotente para
 * history_chapters / history_blocks.
 *   bun run scripts/migrate-history-to-db.ts > /tmp/history.sql
 */
import { history } from "../src/content/history";

const q = (v: unknown) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;

const out: string[] = ["BEGIN;"];

history.chapters.forEach((chapter: any, ci: number) => {
  const blocks: { type: string; content: string | null; caption: string | null }[] = [];
  if (chapter.quote) blocks.push({ type: "quote", content: chapter.quote, caption: null });
  for (const section of chapter.sections ?? []) {
    blocks.push({ type: "text", content: section.content ?? "", caption: section.title ?? null });
    for (const card of section.cards ?? [])
      blocks.push({ type: "text", content: card.value, caption: `card:${card.label}` });
    if (section.gallery)
      blocks.push({ type: "gallery", content: JSON.stringify(section.gallery), caption: section.title ?? null });
  }

  out.push(`
WITH upsert AS (
  INSERT INTO public.history_chapters (title, subtitle, year, content, cover_image, order_index, status)
  SELECT ${q(chapter.title)}, ${q(chapter.subtitle)}, NULL, NULL, ${q(chapter.image)}, ${ci}, 'approved'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.history_chapters
    WHERE title = ${q(chapter.title)} AND subtitle IS NOT DISTINCT FROM ${q(chapter.subtitle)}
  )
  RETURNING id
), ch AS (
  SELECT id FROM upsert
  UNION ALL
  SELECT id FROM public.history_chapters
  WHERE title = ${q(chapter.title)} AND subtitle IS NOT DISTINCT FROM ${q(chapter.subtitle)}
  LIMIT 1
), cleared AS (
  DELETE FROM public.history_blocks WHERE chapter_id = (SELECT id FROM ch LIMIT 1) RETURNING 1
)
INSERT INTO public.history_blocks (chapter_id, type, content, caption, order_index)
SELECT (SELECT id FROM ch LIMIT 1), v.type, v.content, v.caption, v.order_index
FROM (VALUES
${blocks
  .map((b, i) => `  (${q(b.type)}, ${q(b.content)}, ${q(b.caption)}, ${i + 1})`)
  .join(",\n")}
) AS v(type, content, caption, order_index);`);
});

out.push("COMMIT;");
console.log(out.join("\n"));
