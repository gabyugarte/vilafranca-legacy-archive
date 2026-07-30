import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TextField } from "@/components/admin/TextField";
import { DateField } from "@/components/admin/DateField";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { InputField } from "@/components/admin/InputField";

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

  await qc.invalidateQueries({
    queryKey: ["bishops"],
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


<TextField
  label="Nombre del obispo"
  value={form.name ?? ""}
  onChange={(value) =>
    setForm({
      ...form,
      name: value,
    })
  }
/>

<ImageUploader
  bucket="bishops"
  value={form.photo_url}
  onChange={(url) =>
    setForm({
      ...form,
      photo_url: url,
    })
  }
/>
<DateField
  label="Inicio"
  value={form.start_date ?? ""}
  onChange={(value) =>
    setForm({
      ...form,
      start_date: value,
    })
  }
/>

<DateField
  label="Fin"
  value={form.end_date ?? ""}
  onChange={(value) =>
    setForm({
      ...form,
      end_date: value,
    })
  }
/>


<TextAreaField
  label="Biografía"
  value={form.bio}
  onChange={(value) =>
    setForm({
      ...form,
      bio: value,
    })
  }
/>


<InputField
  label="Primer consejero"
  value={form.counselor_1}
  onChange={(value) =>
    setForm({
      ...form,
      counselor_1: value,
    })
  }
/>

<InputField
  label="Segundo consejero"
  value={form.counselor_2}
  onChange={(value) =>
    setForm({
      ...form,
      counselor_2: value,
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