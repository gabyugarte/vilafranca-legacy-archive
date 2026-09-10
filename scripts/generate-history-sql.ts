import { history } from "../src/content/history";
import { writeFileSync } from "node:fs";

function sqlString(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${value.replace(/'/g, "''")}'`;
}

function jsonString(value: unknown): string {
  return sqlString(JSON.stringify(value));
}

const sql: string[] = [];

sql.push(`-- ============================================================`);
sql.push(`-- MIGRACIÓN DE LA HISTORIA DEL BARRIO VILAFRANCA`);
sql.push(`-- Generada automáticamente desde src/content/history.ts`);
sql.push(`-- ============================================================`);
sql.push(``);
sql.push(`BEGIN;`);
sql.push(``);

sql.push(`-- ============================================================`);
sql.push(`-- VERIFICACIÓN PREVIA`);
sql.push(`-- ============================================================`);
sql.push(`SELECT COUNT(*) AS chapters_before FROM history_chapters;`);
sql.push(`SELECT COUNT(*) AS blocks_before FROM history_blocks;`);
sql.push(``);

for (
  let chapterIndex = 0;
  chapterIndex < history.chapters.length;
  chapterIndex++
) {
  const chapter = history.chapters[chapterIndex];
  const chapterVariable = `chapter_${chapterIndex + 1}`;

  sql.push(``);
  sql.push(`-- ============================================================`);
  sql.push(`-- ${chapter.title}`);
  sql.push(`-- ============================================================`);

  sql.push(`DO $$`);
  sql.push(`DECLARE`);
  sql.push(`  ${chapterVariable} uuid;`);
  sql.push(`BEGIN`);

  sql.push(`  SELECT id INTO ${chapterVariable}`);
  sql.push(`  FROM history_chapters`);
  sql.push(
    `  WHERE title = ${sqlString(chapter.title)} AND subtitle = ${sqlString(
      chapter.subtitle,
    )}`,
  );
  sql.push(`  LIMIT 1;`);
  sql.push(``);

  sql.push(`  IF ${chapterVariable} IS NULL THEN`);

  sql.push(`    INSERT INTO history_chapters (`);
  sql.push(`      title,`);
  sql.push(`      subtitle,`);
  sql.push(`      year,`);
  sql.push(`      content,`);
  sql.push(`      cover_image,`);
  sql.push(`      order_index,`);
  sql.push(`      status`);
  sql.push(`    ) VALUES (`);
  sql.push(`      ${sqlString(chapter.title)},`);
  sql.push(`      ${sqlString(chapter.subtitle)},`);
  sql.push(`      NULL,`);
  sql.push(`      ${sqlString(chapter.quote)},`);
  sql.push(`      ${sqlString(chapter.image)},`);
  sql.push(`      ${chapterIndex + 1},`);
  sql.push(`      'approved'`);
  sql.push(`    )`);
  sql.push(`    RETURNING id INTO ${chapterVariable};`);
  sql.push(``);

  sql.push(
    `    RAISE NOTICE 'Capítulo creado: %', ${chapterVariable};`,
  );
  sql.push(``);

  // ----------------------------------------------------------
  // Cita del capítulo
  // ----------------------------------------------------------

  sql.push(`    INSERT INTO history_blocks (`);
  sql.push(`      chapter_id,`);
  sql.push(`      type,`);
  sql.push(`      content,`);
  sql.push(`      caption,`);
  sql.push(`      order_index`);
  sql.push(`    ) VALUES (`);
  sql.push(`      ${chapterVariable},`);
  sql.push(`      'quote',`);
  sql.push(`      ${sqlString(chapter.quote)},`);
  sql.push(`      NULL,`);
  sql.push(`      0`);
  sql.push(`    );`);
  sql.push(``);

  // ----------------------------------------------------------
  // Secciones
  // ----------------------------------------------------------

  for (
    let sectionIndex = 0;
    sectionIndex < chapter.sections.length;
    sectionIndex++
  ) {
    const section = chapter.sections[sectionIndex];

    const textOrder = sectionIndex * 10 + 1;

    sql.push(`    -- Sección: ${section.title}`);

    sql.push(`    INSERT INTO history_blocks (`);
    sql.push(`      chapter_id,`);
    sql.push(`      type,`);
    sql.push(`      content,`);
    sql.push(`      caption,`);
    sql.push(`      order_index`);
    sql.push(`    ) VALUES (`);
    sql.push(`      ${chapterVariable},`);
    sql.push(`      'text',`);
    sql.push(`      ${sqlString(section.content.trim())},`);
    sql.push(`      ${sqlString(section.title)},`);
    sql.push(`      ${textOrder}`);
    sql.push(`    );`);
    sql.push(``);

    // --------------------------------------------------------
    // Galería
    // --------------------------------------------------------

    if (section.gallery && section.gallery.length > 0) {
      const galleryOrder = sectionIndex * 10 + 2;

      sql.push(`    -- Galería: ${section.title}`);

      sql.push(`    INSERT INTO history_blocks (`);
      sql.push(`      chapter_id,`);
      sql.push(`      type,`);
      sql.push(`      content,`);
      sql.push(`      caption,`);
      sql.push(`      order_index`);
      sql.push(`    ) VALUES (`);
      sql.push(`      ${chapterVariable},`);
      sql.push(`      'gallery',`);
      sql.push(`      ${jsonString(section.gallery)},`);
      sql.push(`      ${sqlString(section.title)},`);
      sql.push(`      ${galleryOrder}`);
      sql.push(`    );`);
      sql.push(``);
    }

    // --------------------------------------------------------
    // Tarjetas
    // --------------------------------------------------------

    if (section.cards && section.cards.length > 0) {
      for (
        let cardIndex = 0;
        cardIndex < section.cards.length;
        cardIndex++
      ) {
        const card = section.cards[cardIndex];

        const cardOrder =
          sectionIndex * 10 + 3 + cardIndex;

        sql.push(`    -- Tarjeta: ${card.label}`);

        sql.push(`    INSERT INTO history_blocks (`);
        sql.push(`      chapter_id,`);
        sql.push(`      type,`);
        sql.push(`      content,`);
        sql.push(`      caption,`);
        sql.push(`      order_index`);
        sql.push(`    ) VALUES (`);
        sql.push(`      ${chapterVariable},`);
        sql.push(`      'text',`);
        sql.push(`      ${sqlString(card.value)},`);
        sql.push(`      ${sqlString(`card:${card.label}`)},`);
        sql.push(`      ${cardOrder}`);
        sql.push(`    );`);
        sql.push(``);
      }
    }
  }

  sql.push(`  ELSE`);
  sql.push(
    `    RAISE NOTICE 'El capítulo ya existe: %', ${chapterVariable};`,
  );
  sql.push(`  END IF;`);

  sql.push(`END $$;`);
  sql.push(``);
}

sql.push(`-- ============================================================`);
sql.push(`-- VERIFICACIÓN FINAL`);
sql.push(`-- ============================================================`);

sql.push(`SELECT`);
sql.push(`  id,`);
sql.push(`  title,`);
sql.push(`  subtitle,`);
sql.push(`  order_index,`);
sql.push(`  status`);
sql.push(`FROM history_chapters`);
sql.push(`ORDER BY order_index;`);
sql.push(``);

sql.push(`SELECT`);
sql.push(`  chapter_id,`);
sql.push(`  type,`);
sql.push(`  caption,`);
sql.push(`  order_index`);
sql.push(`FROM history_blocks`);
sql.push(`ORDER BY chapter_id, order_index;`);
sql.push(``);

sql.push(`COMMIT;`);
sql.push(``);

const output = sql.join("\n");

writeFileSync(
  "scripts/migrate-history.sql",
  output,
  {
    encoding: "utf8",
  },
);

console.log(
  "✅ SQL generado correctamente: scripts/migrate-history.sql",
);

console.log(
  `📖 Capítulos: ${history.chapters.length}`,
);

console.log(
  `📄 Archivo: scripts/migrate-history.sql`,
);