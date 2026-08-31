import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { history } from "@/content/history";
import type { Database } from "@/integrations/supabase/types";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_KEY!,
);

async function migrateHistory() {
  console.log("🚀 Iniciando migración de la historia...");

  // ============================================================
  // 1. Comprobar si ya existen capítulos
  // ============================================================

  const { data: existingChapters, error: existingError } =
    await supabase
      .from("history_chapters")
      .select("id, title");

  if (existingError) {
    console.error(
      "❌ Error comprobando capítulos existentes:",
      existingError.message,
    );
    return;
  }

  if (existingChapters && existingChapters.length > 0) {
    console.log(
      "⚠️ Ya existen capítulos en history_chapters.",
    );
    console.log(existingChapters);

    console.log(
      "🛑 La migración se detiene para evitar duplicados.",
    );

    return;
  }

  // ============================================================
  // 2. Crear los capítulos
  // ============================================================

  for (let chapterIndex = 0; chapterIndex < history.chapters.length; chapterIndex++) {
    const chapter = history.chapters[chapterIndex];

    console.log(
      `\n📖 Migrando ${chapter.title}...`,
    );

    // ----------------------------------------------------------
    // Crear capítulo
    // ----------------------------------------------------------

    const { data: insertedChapter, error: chapterError } =
      await supabase
        .from("history_chapters")
        .insert({
          title: chapter.title,
          subtitle: chapter.subtitle,
          year: null,
          content: chapter.quote,
          cover_image: chapter.image,
          order_index: chapterIndex + 1,
          status: "approved",
        })
        .select()
        .single();

    if (chapterError || !insertedChapter) {
      console.error(
        `❌ Error creando ${chapter.title}:`,
        chapterError?.message,
      );

      return;
    }

    console.log(
      `✅ Capítulo creado: ${insertedChapter.title}`,
    );

    // ==========================================================
    // 3. Crear bloques correspondientes a las secciones
    // ==========================================================

    for (
      let sectionIndex = 0;
      sectionIndex < chapter.sections.length;
      sectionIndex++
    ) {
      const section = chapter.sections[sectionIndex];

      // --------------------------------------------------------
      // Bloque de texto
      // --------------------------------------------------------

      let textContent = section.content.trim();

      if (section.title) {
        textContent = `${section.title}\n\n${textContent}`;
      }

      const { error: textError } = await supabase
        .from("history_blocks")
        .insert({
          chapter_id: insertedChapter.id,
          type: "text",
          content: textContent,
          order_index: sectionIndex * 10 + 1,
        });

      if (textError) {
        console.error(
          `❌ Error creando bloque de texto "${section.title}":`,
          textError.message,
        );

        return;
      }

      console.log(
        `   📝 Texto: ${section.title}`,
      );

      // --------------------------------------------------------
      // Galería
      // --------------------------------------------------------

      if (
        section.gallery &&
        section.gallery.length > 0
      ) {
        const { error: galleryError } =
          await supabase
            .from("history_blocks")
            .insert({
              chapter_id: insertedChapter.id,
              type: "gallery",
              content: JSON.stringify(section.gallery),
              order_index: sectionIndex * 10 + 2,
            });

        if (galleryError) {
          console.error(
            `❌ Error creando galería "${section.title}":`,
            galleryError.message,
          );

          return;
        }

        console.log(
          `   🖼 Galería: ${section.gallery.length} imágenes`,
        );
      }

      // --------------------------------------------------------
      // Cards
      // --------------------------------------------------------

      if (
        section.cards &&
        section.cards.length > 0
      ) {
        for (
          let cardIndex = 0;
          cardIndex < section.cards.length;
          cardIndex++
        ) {
          const card = section.cards[cardIndex];

          const cardContent =
            `${card.label}\n${card.value}`;

          const { error: cardError } =
            await supabase
              .from("history_blocks")
              .insert({
                chapter_id: insertedChapter.id,
                type: "text",
                content: cardContent,
                order_index:
                  sectionIndex * 10 + 3 + cardIndex,
              });

          if (cardError) {
            console.error(
              `❌ Error creando tarjeta "${card.label}":`,
              cardError.message,
            );

            return;
          }
        }

        console.log(
          `   🗂 ${section.cards.length} tarjetas`,
        );
      }
    }
  }

  console.log("\n🎉 ¡Migración completada!");
}

migrateHistory()
  .then(() => {
    console.log("✅ Proceso terminado.");
  })
  .catch((error) => {
console.error(
      "❌ Error inesperado:",
      error,
    );
  });