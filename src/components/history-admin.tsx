import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { HistoryModal } from "@/components/history-modal";


export function HistoryAdmin() {
const qc = useQueryClient();
const [editing, setEditing] = useState<any | null>(null);
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["admin", "history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("history_chapters")
        .select("*")
        .order("order_index", {
          ascending: true,
        });

      if (error) throw error;

      return data;
    },
  });
async function remove(id: string) {
  if (!confirm("¿Eliminar este capítulo?")) return;

  const { error } = await supabase
    .from("history_chapters")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  const { data: remainingChapters, error: fetchError } = await supabase
    .from("history_chapters")
    .select("id")
    .order("order_index", { ascending: true });

  if (fetchError) {
    alert(fetchError.message);
    return;
  }

  for (let index = 0; index < (remainingChapters?.length ?? 0); index++) {
    const { error: updateError } = await supabase
      .from("history_chapters")
      .update({ order_index: -(index + 1) })
      .eq("id", remainingChapters[index].id);

    if (updateError) {
      alert(updateError.message);
      return;
    }
  }

  for (let index = 0; index < (remainingChapters?.length ?? 0); index++) {
    const { error: updateError } = await supabase
      .from("history_chapters")
      .update({ order_index: index + 1 })
      .eq("id", remainingChapters[index].id);

    if (updateError) {
      alert(updateError.message);
      return;
    }
  }

  await qc.invalidateQueries({
    queryKey: ["admin", "history"],
  });

  await qc.invalidateQueries({
    queryKey: ["history"],
  });
}

async function moveChapter(
  id: string,
  direction: "up" | "down"
) {
  if (!chapters) return;

  const currentIndex = chapters.findIndex(
    (chapter) => chapter.id === id
  );

  if (currentIndex === -1) return;

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= chapters.length
  ) {
    return;
  }

  const currentChapter = chapters[currentIndex];
  const targetChapter = chapters[targetIndex];

  const currentOrder = currentChapter.order_index;
  const targetOrder = targetChapter.order_index;

  // Usamos temporalmente -1 para evitar conflictos
  // si order_index tiene una restricción de unicidad.
  let { error } = await supabase
    .from("history_chapters")
    .update({ order_index: -1 })
    .eq("id", currentChapter.id);

  if (error) {
    alert(error.message);
    return;
  }

  ({ error } = await supabase
    .from("history_chapters")
    .update({ order_index: currentOrder })
    .eq("id", targetChapter.id));

  if (error) {
    alert(error.message);
    return;
  }

  ({ error } = await supabase
    .from("history_chapters")
    .update({ order_index: targetOrder })
    .eq("id", currentChapter.id));

  if (error) {
    alert(error.message);
    return;
  }

  await qc.invalidateQueries({
    queryKey: ["admin", "history"],
  });
}
  return (
    <div className="space-y-6">

      <div className="flex justify-end">
<button
  onClick={() =>
    setEditing({
  title: "",
  subtitle: "",
  year: null,
  content: "",
  cover_image: "",
})
  }
  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
>
          <Plus className="h-4 w-4" />
          Nuevo capítulo
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
<div className="overflow-hidden rounded-2xl border border-border bg-card">

  <table className="w-full text-sm">

    <thead className="bg-muted">

      <tr>
        <th className="px-4 py-3 text-left">Orden</th>
        <th className="px-4 py-3 text-left">Año</th>
        <th className="px-4 py-3 text-left">Título</th>
        <th className="px-4 py-3 text-left">Estado</th>
        <th className="px-4 py-3 text-right">Acciones</th>
      </tr>

    </thead>

    <tbody>

      {chapters?.map((chapter) => (

        <tr key={chapter.id} className="border-t">

          <td className="px-4 py-3">
            {chapter.order_index}
          </td>

          <td className="px-4 py-3">
            {chapter.year}
          </td>

          <td className="px-4 py-3">
            {chapter.title}
          </td>
          <td className="px-4 py-3">
  {chapter.status === "approved" ? (
    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
      🟢 Aprobado
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
      🟡 Pendiente
    </span>
  )}
</td>

<td className="px-4 py-3 text-right">

<div className="flex justify-end gap-2">

  <button
    type="button"
    onClick={() => moveChapter(chapter.id, "up")}
    disabled={chapters?.findIndex((c) => c.id === chapter.id) === 0}
    className="rounded-full p-2 hover:bg-secondary disabled:opacity-30"
    title="Subir capítulo"
  >
    <ArrowUp className="h-4 w-4" />
  </button>

  <button
    type="button"
    onClick={() => moveChapter(chapter.id, "down")}
    disabled={
      chapters?.findIndex((c) => c.id === chapter.id) ===
      (chapters?.length ?? 1) - 1
    }
    className="rounded-full p-2 hover:bg-secondary disabled:opacity-30"
    title="Bajar capítulo"
  >
    <ArrowDown className="h-4 w-4" />
  </button>

  <button
    type="button"
    onClick={() => setEditing(chapter)}
    className="rounded-full p-2 hover:bg-secondary"
    title="Editar capítulo"
  >
    <Pencil className="h-4 w-4" />
  </button>

  <button
    type="button"
    onClick={() => remove(chapter.id)}
    className="rounded-full p-2 text-destructive hover:bg-destructive/10"
    title="Eliminar capítulo"
  >
    <Trash2 className="h-4 w-4" />
  </button>

</div>

</td>

        </tr>

      ))}

      {!chapters?.length && (
        <tr>
          <td
            colSpan={5}
            className="py-10 text-center text-muted-foreground"
          >
            Todavía no hay capítulos.
          </td>
        </tr>
      )}

    </tbody>

  </table>

</div>
      )}

    {editing && (
      <HistoryModal
        chapter={editing}
        onClose={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);

          await qc.invalidateQueries({
            queryKey: ["admin", "history"],
          });

          await qc.invalidateQueries({
            queryKey: ["history"],
          });
        }}
      />
    )}
    </div>
  );
}