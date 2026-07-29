import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function BishopsAdmin() {
  const qc = useQueryClient();

  const [editing, setEditing] = useState<any | null>(null);

  const { data: bishops, isLoading } = useQuery({
    queryKey: ["admin", "bishops"],
    queryFn: async () => {
      
      const { data, error } = await supabase
        .from("bishops")
        .select("*")
        .order("start_date", {
  ascending: true,
});

      if (error) throw error;

      return data;
    },
  });

    async function remove(id: string) {
    if (!confirm("¿Eliminar este obispo definitivamente?")) return;

    const { error } = await supabase
      .from("bishops")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    qc.invalidateQueries({
      queryKey: ["admin", "bishops"],
    });
  }
  return (
    <div className="space-y-4">

      <div className="flex justify-end">
<button
  onClick={() =>
    setEditing({
      name: "",
      start_date: "",
      end_date: "",
      bio: "",
      counselor_1: "",
      counselor_2: "",
      order_index: (bishops?.length ?? 0) + 1,
      photo_url: "",
    })
  }
  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
>
          <Plus className="h-4 w-4" />
          Nuevo obispo
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
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Inicio</th>
                <th className="px-4 py-3 text-left">Fin</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {bishops?.map((bishop) => (
                <tr key={bishop.id} className="border-t">

                  <td className="px-4 py-3">
                    {bishop.name}
                  </td>

                  <td className="px-4 py-3">
                    {bishop.start_date}
                  </td>

                  <td className="px-4 py-3">
                    {bishop.end_date ?? "Actualidad"}
                  </td>

                  <td className="px-4 py-3 text-right">
                  <button
  onClick={() => setEditing(bishop)}
  className="rounded-full p-2 hover:bg-secondary"
>
                      <Pencil className="h-4 w-4" />
                    </button>

<button
  onClick={() => remove(bishop.id)}
  className="rounded-full p-2 text-destructive hover:bg-destructive/10"
>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
    {editing && (
<BishopModal
  bishop={editing}
  onClose={() => setEditing(null)}
  onSaved={async () => {
    setEditing(null);

    await qc.invalidateQueries({
      queryKey: ["admin", "bishops"],
    });
  }}
/>
    )}
    </div>
  );
  
}
function BishopModal({
  bishop,
  onClose,
  onSaved,
}: {
  bishop: any;
  onClose: () => void;
  onSaved: () => void;
}) {

  const [form, setForm] = useState(bishop);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadPhoto(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  const extension = file.name.split(".").pop();

  const filename =
    `${bishop.id}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("bishops")
    .upload(filename, file, {
      upsert: true,
    });

  if (error) {
    alert(error.message);
    setUploading(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("bishops")
    .getPublicUrl(filename);

  setForm((prev: any) => ({
    ...prev,
    photo_url: publicUrl,
  }));

  setUploading(false);
}

  async function save(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

let data;
let error;

if (bishop.id) {
  ({ data, error } = await supabase
    .from("bishops")
    .update({
      name: form.name,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      photo_url: form.photo_url || null,
      bio: form.bio || null,
      counselor_1: form.counselor_1 || null,
      counselor_2: form.counselor_2 || null,
      order_index: form.order_index,
      
    })
    .eq("id", bishop.id)
    .select());
} else {
  ({ data, error } = await supabase
    .from("bishops")
    .insert({
      name: form.name,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      bio: form.bio || null,
      counselor_1: form.counselor_1 || null,
      counselor_2: form.counselor_2 || null,
      order_index: form.order_index,
      photo_url: form.photo_url || null,
    })
    .select());
}


console.log("UPDATED:", data);
console.log("ERROR:", error);
console.log("FORM:", form);

    setSaving(false);


    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <form
        onSubmit={save}
        className="w-full max-w-xl space-y-4 rounded-2xl bg-background p-6"
      >

        <h2 className="text-2xl font-bold">
          {bishop.id ? "Editar obispo" : "Nuevo obispo"}
        </h2>


        <input
          className="w-full rounded-lg border p-2"
          value={form.name ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

<input
  className="w-full rounded-lg border p-2"
  placeholder="URL de la fotografía"
  value={form.photo_url ?? ""}
  onChange={(e) =>
    setForm({
      ...form,
      photo_url: e.target.value,
    })
  }
/>
<input
  type="file"
  accept="image/*"
  onChange={uploadPhoto}
/>
{uploading && (
  <p className="text-sm text-muted-foreground">
    Subiendo fotografía...
  </p>
)}

{form.photo_url && (
  <img
    src={form.photo_url}
    alt="Vista previa"
    className="h-40 rounded-xl object-cover border"
  />
)}
        <input
          type="date"
          className="w-full rounded-lg border p-2"
          value={form.start_date ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              start_date: e.target.value,
            })
          }
        />


        <input
          type="date"
          className="w-full rounded-lg border p-2"
          value={form.end_date ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              end_date: e.target.value,
            })
          }
        />


        <textarea
          className="w-full rounded-lg border p-2"
          placeholder="Biografía"
          value={form.bio ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              bio: e.target.value,
            })
          }
        />


        <input
          className="w-full rounded-lg border p-2"
          placeholder="Primer consejero"
          value={form.counselor_1 ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              counselor_1: e.target.value,
            })
          }
        />


        <input
          className="w-full rounded-lg border p-2"
          placeholder="Segundo consejero"
          value={form.counselor_2 ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              counselor_2: e.target.value,
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

    </div>
  );
}