import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TextField } from "@/components/admin/TextField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { InputField } from "@/components/admin/InputField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Database } from "@/integrations/supabase/types";
import { HistoryBlocksEditor } from "@/components/history-blocks-editor";

type HistoryRow =
  Database["public"]["Tables"]["history_chapters"]["Row"];

type HistoryInsert =
  Database["public"]["Tables"]["history_chapters"]["Insert"];
type HistoryModalProps = {
  chapter: Partial<HistoryRow>;
  onClose: () => void;
  onSaved: () => void;
};

export function HistoryModal({
  chapter,
  onClose,
  onSaved,
}: HistoryModalProps) {

const [form, setForm] =
  useState<Partial<HistoryRow>>(chapter);
  const [saving, setSaving] = useState(false);

async function save(e: React.FormEvent) {
  e.preventDefault();

  setSaving(true);
  let orderIndex = Number(form.order_index ?? 1);

if (!form.id) {
  const { data: lastChapter, error: orderError } = await supabase
    .from("history_chapters")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    setSaving(false);
    alert(orderError.message);
    return;
  }

  orderIndex = (lastChapter?.order_index ?? 0) + 1;
}

const payload: HistoryInsert = {
  title: form.title ?? "",
  subtitle: form.subtitle || null,
  year: form.year ? Number(form.year) : null,
  content: form.content || null,
  cover_image: form.cover_image || null,
  order_index: orderIndex,
  status: form.id
    ? form.status ?? "pending"
    : "pending",
  submitted_by: form.submitted_by ?? null,
};

  let error;

  if (form.id) {
    ({ error } = await supabase
      .from("history_chapters")
      .update(payload)
      .eq("id", form.id));
  } else {
    ({ error } = await supabase
      .from("history_chapters")
      .insert(payload));
  }

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }

  onSaved();
}

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

  <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-6 space-y-6">
  <button
    type="button"
    onClick={onClose}
    aria-label="Cerrar"
    title="Cerrar"
    className="sticky top-0 ml-auto z-50 flex h-9 w-9 items-center justify-center rounded-full bg-background text-xl text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
  >
    ×
  </button>
      <form
        onSubmit={save}
        className="space-y-4"
      >

        <h2 className="text-2xl font-bold">
          {chapter.id ? "Editar capítulo" : "Nuevo capítulo"}
        </h2>

        <TextField
          label="Título"
          value={form.title ?? ""}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
        />

        <InputField
          label="Subtítulo"
          value={form.subtitle ?? ""}
          onChange={(value) =>
            setForm({
              ...form,
              subtitle: value,
            })
          }
        />

        <InputField
          label="Año"
          value={form.year?.toString() ?? ""}
          onChange={(value) =>
            setForm({
              ...form,
              year: value === "" ? null : Number(value),
            })
          }
        />

        <ImageUploader
          bucket="media"
          value={form.cover_image}
          onChange={(url) =>
            setForm({
              ...form,
              cover_image: url,
            })
          }
        />

        <TextAreaField
          label="Contenido"
          value={form.content ?? ""}
          onChange={(value) =>
            setForm({
              ...form,
              content: value,
            })
          }
        />

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-4 py-2"
          >
            Cancelar
          </button>

          <button
            disabled={saving}
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>

        </div>

      </form>

      {form.id && (
        
        <HistoryBlocksEditor
          chapterId={form.id!}
        />
      )}

    </div>

  </div>
);
}