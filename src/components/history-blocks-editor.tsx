import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DocumentUploader } from "@/components/admin/DocumentUploader";

type Props = {
  chapterId: string;
};

function parseGalleryContent(content: string | null) {
  try {
    const parsed = JSON.parse(content || "[]");

    // Formato nuevo
    if (
      parsed &&
      !Array.isArray(parsed) &&
      typeof parsed === "object"
    ) {
      return {
        images: Array.isArray(parsed.images) ? parsed.images : [],
        description:
          typeof parsed.description === "string"
            ? parsed.description
            : "",
      };
    }

    // Formato antiguo
    if (Array.isArray(parsed)) {
      return {
        images: parsed,
        description: "",
      };
    }

    return {
      images: [],
      description: "",
    };
  } catch {
    return {
      images: [],
      description: "",
    };
  }
}

export function HistoryBlocksEditor({
  chapterId,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingCaption, setEditingCaption] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["history-blocks", chapterId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("history_blocks")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index");

      if (error) throw error;

      return data;
    },
  });

    async function addTextBlock() {
    const { data, error } = await supabase
      .from("history_blocks")
      .insert({
        chapter_id: chapterId,
        type: "text",
        content: "",
        order_index: (blocks?.length ?? 0) + 1,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }
await queryClient.invalidateQueries({
  queryKey: ["history-blocks", chapterId],
});
    setAdding(false);
    setEditingId(data.id);
    setEditingContent(data.content ?? "");
  }

async function addImageBlock() {
  const { data, error } = await supabase
    .from("history_blocks")
    .insert({
      chapter_id: chapterId,
      type: "image",
      content: "",
      order_index: (blocks?.length ?? 0) + 1,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

  setAdding(false);
  setEditingId(data.id);
  setEditingContent(data.content ?? "");
  setEditingCaption(data.caption ?? "");
  setEditingType("image");
}

async function addDocumentBlock() {
  const { data, error } = await supabase
    .from("history_blocks")
    .insert({
      chapter_id: chapterId,
      type: "document",
      content: "",
      order_index: (blocks?.length ?? 0) + 1,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

  setAdding(false);
  setEditingId(data.id);
  setEditingContent(data.content ?? "");
  setEditingType("document");
}

async function addVideoBlock() {
  const { data, error } = await supabase
    .from("history_blocks")
    .insert({
      chapter_id: chapterId,
      type: "video",
      content: "",
      order_index: (blocks?.length ?? 0) + 1,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

  setAdding(false);
  setEditingId(data.id);
  setEditingContent(data.content ?? "");
  setEditingType("video");
}

async function addQuoteBlock() {
  const { data, error } = await supabase
    .from("history_blocks")
    .insert({
      chapter_id: chapterId,
      type: "quote",
      content: "",
      order_index: (blocks?.length ?? 0) + 1,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

  setAdding(false);
  setEditingId(data.id);
  setEditingContent(data.content ?? "");
  setEditingType("quote");
}

async function addGalleryBlock() {
  const { data, error } = await supabase
    .from("history_blocks")
    .insert({
      chapter_id: chapterId,
      type: "gallery",
      content: JSON.stringify({
      description: "",
      images: [],
    }),
      order_index: (blocks?.length ?? 0) + 1,
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

setAdding(false);
setEditingId(data.id);
setEditingContent("[]");
setEditingCaption(data.caption ?? "");
setEditingDescription("");
setEditingType("gallery");
}


async function saveBlock(id: string) {
  setSaving(true);

let contentToSave = editingContent;

if (editingType === "gallery") {
  let galleryImages: string[] = [];

  try {
    galleryImages = JSON.parse(editingContent || "[]");
  } catch {
    galleryImages = [];
  }

  contentToSave = JSON.stringify({
    description: editingDescription,
    images: galleryImages,
  });
}

const { error } = await supabase
  .from("history_blocks")
  .update({
    content: contentToSave,
    caption: editingCaption || null,
  })
  .eq("id", id);

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

  await queryClient.invalidateQueries({
    queryKey: ["history-chapter", chapterId],
  });

  setEditingId(null);
  setEditingContent("");
  setEditingCaption("");
  setEditingType(null);
}


  async function deleteBlock(id: string) {
  if (!confirm("¿Seguro que quieres eliminar este bloque?")) {
    return;
  }

  const { error } = await supabase
    .from("history_blocks")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await queryClient.invalidateQueries({
    queryKey: ["history-blocks", chapterId],
  });

  if (editingId === id) {
    setEditingId(null);
    setEditingContent("");
  }
}

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h3 className="text-xl font-semibold">
          Contenido del capítulo
        </h3>

        <button
          onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Añadir bloque
        </button>

      </div>

      {adding && (

        <div className="rounded-2xl border bg-muted/40 p-6">

          <p className="font-medium mb-4">
            ¿Qué tipo de bloque deseas añadir?
          </p>

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={addTextBlock}
              className="rounded-xl border px-4 py-3 text-sm hover:bg-muted"
            >
              📝 Texto
            </button>

            <button
              type="button"
              onClick={addImageBlock}
              className="rounded-xl border p-4 hover:bg-background"
            >
              🖼 Imagen
            </button>

            <button
              type="button"
              onClick={addGalleryBlock}
              className="rounded-xl border p-4 hover:bg-background"
            >
              🖼 Galería
            </button>

            <button
              type="button"
              onClick={addDocumentBlock}
              className="rounded-xl border p-4 hover:bg-background"
            >
              📄 Documento
            </button>

            <button
              type="button"
              onClick={addVideoBlock}
              className="rounded-xl border p-4 hover:bg-background"
            >
             🎥 Vídeo
            </button>

            <button
              type="button"
              onClick={addQuoteBlock}
              className="rounded-xl border p-4 hover:bg-background"
            >
             💬 Cita
            </button>

          </div>

        </div>

      )}

      {isLoading ? (

        <div className="grid place-items-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>

      ) : (

        <div className="space-y-4">
{blocks?.map((block) => (
  <div
    key={block.id}
    className="rounded-xl border p-4"
  >
<div className="mt-2">

{block.type === "image" ? (
  block.content ? (
    <div className="overflow-hidden rounded-xl border bg-muted/20">
      <img
        src={block.content}
        alt="Imagen del capítulo"
        className="max-h-[500px] w-full object-contain"
      />
    </div>
  ) : (
    <span className="text-muted-foreground">
      Esta imagen todavía no tiene contenido.
    </span>
  )

) : block.type === "document" ? (

  block.content ? (
    <div className="rounded-xl border bg-muted/30 p-4">
      <div className="flex items-center gap-3">

        <div className="text-2xl">
          📄
        </div>

        <div className="flex-1">
          <p className="font-medium">
            Documento PDF
          </p>

          <a
            href={block.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline"
          >
            Abrir documento
          </a>
        </div>

      </div>
    </div>
  ) : (
    <span className="text-muted-foreground">
      Este documento todavía no tiene archivo.
    </span>
  )

) : block.type === "video" ? (

  block.content ? (
    <div className="rounded-xl border bg-muted/30 p-4">
      <div className="flex items-center gap-3">

        <div className="text-2xl">
          🎥
        </div>

        <div className="flex-1">
          <p className="font-medium">
            Vídeo
          </p>

          <a
            href={block.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline"
          >
            Ver vídeo
          </a>
        </div>

      </div>
    </div>
  ) : (
    <span className="text-muted-foreground">
      Este vídeo todavía no tiene contenido.
    </span>
  )

) : block.type === "gallery" ? (

  block.content ? (
    (() => {
      let galleryImages: string[] = [];

      try {
        galleryImages = JSON.parse(block.content);
      } catch {
        galleryImages = [];
      }

      return galleryImages.length > 0 ? (
        <div className="space-y-3">

          <div className="flex items-center gap-2">
            <span className="text-2xl">🖼</span>

            <p className="font-medium">
              Galería
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">

            {galleryImages.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-xl border bg-muted/20"
              >
                <img
                  src={url}
                  alt={`Imagen ${index + 1} de la galería`}
                  className="h-40 w-full object-cover"
                />
              </div>
            ))}

          </div>

        </div>
      ) : (
        <span className="text-muted-foreground">
          Esta galería todavía no tiene imágenes.
        </span>
      );
    })()
  ) : (
    <span className="text-muted-foreground">
      Esta galería todavía no tiene imágenes.
    </span>
  )
) : block.type === "quote" ? (

  block.content ? (
    <div className="rounded-xl border bg-muted/30 p-5">

      <div className="flex gap-3">

        <div className="text-2xl">
          💬
        </div>

        <blockquote className="flex-1 text-base italic leading-relaxed break-words">
          “{block.content}”
        </blockquote>

      </div>

    </div>
  ) : (
    <span className="text-muted-foreground">
      Esta cita todavía no tiene contenido.
    </span>
  )

) : block.type === "text" ? (

  block.content || (
    <span className="text-muted-foreground">
      Este bloque todavía no tiene contenido.
    </span>
  )

) : null}

  <div className="mt-3 flex justify-end gap-2">

    <button
      type="button"
onClick={() => {
  setEditingId(block.id);
  setEditingCaption(block.caption ?? "");
  setEditingType(block.type);

  if (block.type === "gallery") {
    const gallery = parseGalleryContent(block.content);
    setEditingContent(JSON.stringify(gallery.images));
    setEditingDescription(gallery.description);
  } else {
    setEditingContent(block.content ?? "");
    setEditingDescription("");
  }
}}
      className="rounded-xl border px-4 py-2 text-sm hover:bg-muted"
    >
      ✏️ Editar
    </button>

    <button
      type="button"
      onClick={() => deleteBlock(block.id)}
      className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="h-4 w-4" />
      Eliminar
    </button>

  </div>

</div>

    {editingId === block.id ? (
      <div className="mt-3 space-y-3">

{editingType === "image" ? (
  <div className="space-y-4">

    <ImageUploader
      bucket="media"
      value={editingContent}
      onChange={(url) => setEditingContent(url)}
    />

    {editingContent && (
      <div className="overflow-hidden rounded-xl border bg-muted/20">
        <img
          src={editingContent}
          alt="Vista previa"
          className="max-h-[400px] w-full object-contain"
        />
      </div>
    )}

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Pie de foto / descripción
      </label>

      <textarea
        value={editingCaption}
        onChange={(e) => setEditingCaption(e.target.value)}
        placeholder="Describe esta imagen histórica..."
        className="min-h-[90px] w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <p className="text-xs text-muted-foreground">
        Puedes indicar quién aparece, qué actividad es, dónde o cuándo fue tomada, o cualquier otro dato histórico relevante.
      </p>
    </div>

  </div>
) : editingType === "document" ? (
  <DocumentUploader
    bucket="media"
    value={editingContent}
    onChange={(url) => setEditingContent(url)}
  />

  ) : editingType === "video" ? (

  <div className="space-y-3">

    <label className="text-sm font-medium">
      URL del vídeo
    </label>

    <input
      type="url"
      value={editingContent}
      onChange={(e) => setEditingContent(e.target.value)}
      placeholder="https://www.youtube.com/watch?v=..."
      className="w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <p className="text-xs text-muted-foreground">
      Puedes pegar el enlace de un vídeo de YouTube o Vimeo.
    </p>

  </div>

) : editingType === "gallery" ? (

  <div className="space-y-4">

    <div className="space-y-2">
      <label className="text-sm font-medium">
        Título de la galería
      </label>

      <input
        type="text"
        value={editingCaption}
        onChange={(e) => setEditingCaption(e.target.value)}
        placeholder="Ej.: Actividades del Barrio Vilafranca"
        className="w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <p className="text-xs text-muted-foreground">
        Escribe un título que identifique las fotografías de esta galería.
      </p>
    </div>
<div className="space-y-2">
  <label className="text-sm font-medium">
    Descripción de la galería
  </label>

  <textarea
    value={editingDescription}
    onChange={(e) => setEditingDescription(e.target.value)}
    placeholder="Ej.: Fotografías de las actividades realizadas por los miembros del barrio durante este período."
    className="min-h-[90px] w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
  />

  <p className="text-xs text-muted-foreground">
    Puedes explicar brevemente qué muestran las fotografías o aportar información histórica sobre ellas.
  </p>
</div>
    <div>
      <p className="text-sm font-medium">
        Imágenes de la galería
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Añade las imágenes que formarán parte de esta galería.
      </p>
    </div>

    <div className="space-y-4">

      {(() => {
const galleryImages: string[] = parseGalleryContent(editingContent).images;
        return galleryImages.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="rounded-xl border bg-muted/20 p-4"
          >

            <div className="mb-3 flex items-center justify-between">

              <p className="text-sm font-medium">
                Imagen {index + 1}
              </p>

              <button
                type="button"
                onClick={() => {
                  const updatedImages = galleryImages.filter(
                    (_, imageIndex) => imageIndex !== index
                  );

                  setEditingContent(
                    JSON.stringify(updatedImages)
                  );
                }}
                className="text-sm text-destructive hover:underline"
              >
                Eliminar
              </button>

            </div>

            <ImageUploader
              bucket="media"
              value={url}
              onChange={(newUrl) => {
                const updatedImages = [...galleryImages];
                updatedImages[index] = newUrl;

                setEditingContent(
                  JSON.stringify(updatedImages)
                );
              }}
            />

          </div>
        ));
      })()}

    </div>

    <button
      type="button"
      onClick={() => {
const galleryImages: string[] =
  parseGalleryContent(editingContent).images;
        setEditingContent(
          JSON.stringify([...galleryImages, ""])
        );
      }}
      className="w-full rounded-xl border border-dashed p-4 text-sm hover:bg-muted"
    >
      + Añadir imagen
    </button>

  </div>

) : editingType === "quote" ? (
    <div className="space-y-3">

    <label className="text-sm font-medium">
      Texto de la cita
    </label>

    <textarea
      value={editingContent}
      onChange={(e) => setEditingContent(e.target.value)}
      placeholder="Escribe aquí la cita..."
      className="min-h-[120px] w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <p className="text-xs text-muted-foreground">
      Escribe la frase o cita que quieres destacar en este capítulo.
    </p>

  </div>

) : (
  <textarea
    value={editingContent}
    onChange={(e) => setEditingContent(e.target.value)}
    placeholder="Escribe el contenido de este bloque..."
    className="min-h-[160px] w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
  />
)}

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setEditingContent("");
              setEditingType(null);
            }}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancelar
          </button>

<button
  type="button"
  onClick={() => saveBlock(block.id)}
  disabled={saving}
  className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
>
{saving
  ? "Guardando..."
  : editingType === "image"
    ? "Guardar imagen"
    : editingType === "document"
      ? "Guardar documento"
      : editingType === "video"
        ? "Guardar vídeo"
        : editingType === "gallery"
          ? "Guardar galería"
          : editingType === "quote"
            ? "Guardar cita"
            : "Guardar texto"}
</button>

        </div>

      </div>
) : (
  <div className="mt-2">

    {block.type === "text" && (
      <div>
        {block.content || (
          <span className="text-muted-foreground">
            Este bloque todavía no tiene contenido.
          </span>
        )}

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
onClick={() => {
  setEditingId(block.id);
  setEditingContent(block.content ?? "");
  setEditingCaption(block.caption ?? "");
  setEditingType(block.type);
}}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-muted"
          >
            ✏️ Editar
          </button>

          <button
            type="button"
            onClick={() => deleteBlock(block.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>
    )}

  </div>
)}
  </div>
))}

          {!blocks?.length && (

            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">

              Este capítulo todavía no tiene bloques.

            </div>

          )}

        </div>

      )}

    </div>
  );
}