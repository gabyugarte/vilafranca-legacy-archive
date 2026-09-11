import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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

  const [counselorPeriods, setCounselorPeriods] = useState<any[]>([]);
  const [loadingPeriods, setLoadingPeriods] = useState(false);

  useEffect(() => {
  async function loadCounselorPeriods() {
    if (!bishop.id) {
      setCounselorPeriods([]);
      return;
    }

    setLoadingPeriods(true);

    const { data, error } = await supabase
      .from("bishop_counselor_periods")
      .select("*")
      .eq("bishop_id", bishop.id)
      .order("order_index", { ascending: true });

    setLoadingPeriods(false);

    if (error) {
      console.error("Error cargando periodos de consejeros:", error);
      return;
    }

    setCounselorPeriods(data ?? []);
  }

  loadCounselorPeriods();
}, [bishop.id]);

async function save(e: React.FormEvent) {
  e.preventDefault();

  setSaving(true);

  let bishopId = bishop.id;
  let data;
  let error;

  // 1. Guardar los datos del obispo
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

    if (data?.[0]) {
      bishopId = data[0].id;
    }
  }

  console.log("UPDATED BISHOP:", data);
  console.log("ERROR BISHOP:", error);

  // Si hubo un error guardando el obispo, paramos aquí
  if (error || !bishopId) {
    setSaving(false);
    alert(error?.message ?? "No se pudo guardar el obispo.");
    return;
  }

  // 2. Obtener los periodos que ya existen en Supabase
  const { data: existingPeriods, error: existingPeriodsError } =
    await supabase
      .from("bishop_counselor_periods")
      .select("id")
      .eq("bishop_id", bishopId);

  if (existingPeriodsError) {
    setSaving(false);
    alert(existingPeriodsError.message);
    return;
  }

  const currentPeriodIds = counselorPeriods
    .filter((period) => !String(period.id).startsWith("new-"))
    .map((period) => period.id);

  // 3. Eliminar de Supabase los periodos que quitamos del modal
  const periodsToDelete =
    existingPeriods?.filter(
      (period) => !currentPeriodIds.includes(period.id)
    ) ?? [];

  if (periodsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("bishop_counselor_periods")
      .delete()
      .in(
        "id",
        periodsToDelete.map((period) => period.id)
      );

    if (deleteError) {
      setSaving(false);
      alert(deleteError.message);
      return;
    }
  }

  // 4. Guardar cada periodo
  for (let index = 0; index < counselorPeriods.length; index++) {
    const period = counselorPeriods[index];

    const periodData = {
      bishop_id: bishopId,
      start_date: period.start_date,
      end_date: period.end_date || null,
      counselor_1: period.counselor_1 || null,
      counselor_2: period.counselor_2 || null,
      order_index: index + 1,
    };

    if (String(period.id).startsWith("new-")) {
      // Nuevo periodo
      const { error: insertPeriodError } = await supabase
        .from("bishop_counselor_periods")
        .insert(periodData);

      if (insertPeriodError) {
        setSaving(false);
        alert(insertPeriodError.message);
        return;
      }
    } else {
      // Periodo existente
      const { error: updatePeriodError } = await supabase
        .from("bishop_counselor_periods")
        .update(periodData)
        .eq("id", period.id);

      if (updatePeriodError) {
        setSaving(false);
        alert(updatePeriodError.message);
        return;
      }
    }
  }

  console.log("PERIODOS GUARDADOS:", counselorPeriods);

  setSaving(false);

  onSaved();
}


  return (
<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
<form
  onSubmit={save}
  className="w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4 rounded-2xl bg-background p-6"
>
  <button
  type="button"
  onClick={onClose}
  aria-label="Cerrar"
  title="Cerrar"
  className="sticky top-0 ml-auto z-50 flex h-9 w-9 items-center justify-center rounded-full bg-background text-xl text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
>
  ×
</button>

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
<div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
  <div>
    <h3 className="text-base font-semibold">
      Consejeros durante su periodo
    </h3>

    <p className="mt-1 text-sm text-muted-foreground">
      Registra los diferentes equipos de consejeros que tuvo el obispo durante su servicio.
    </p>
  </div>

  {loadingPeriods ? (
    <div className="py-4 text-center text-sm text-muted-foreground">
      Cargando periodos de consejeros...
    </div>
  ) : counselorPeriods.length === 0 ? (
    <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
      No hay periodos de consejeros registrados.
    </div>
  ) : (
    <div className="space-y-3">
      {counselorPeriods.map((period, index) => (
        <div
          key={period.id}
          className="rounded-xl border border-border bg-background p-4"
        >
<div className="mb-3 flex items-center justify-between gap-3">
  <h4 className="font-medium">
    Periodo {index + 1}
  </h4>

  <button
    type="button"
    onClick={() => {
      setCounselorPeriods((prev) =>
        prev
          .filter((item) => item.id !== period.id)
          .map((item, newIndex) => ({
            ...item,
            order_index: newIndex + 1,
          }))
      );
    }}
    className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
  >
    🗑️ Eliminar periodo
  </button>
</div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DateField
              label="Desde"
              value={period.start_date ?? ""}
              onChange={(value) =>
  setCounselorPeriods((prev) =>
    prev.map((item) =>
      item.id === period.id
        ? { ...item, start_date: value }
        : item
    )
  )
}
            />

            <DateField
              label="Hasta"
              value={period.end_date ?? ""}
              onChange={(value) =>
  setCounselorPeriods((prev) =>
    prev.map((item) =>
      item.id === period.id
        ? { ...item, end_date: value }
        : item
    )
  )
}
            />
          </div>

          <div className="mt-3 space-y-3">
            <InputField
              label="Primer consejero"
              value={period.counselor_1 ?? ""}
              onChange={(value) =>
  setCounselorPeriods((prev) =>
    prev.map((item) =>
      item.id === period.id
        ? { ...item, counselor_1: value }
        : item
    )
  )
}
            />

            <InputField
              label="Segundo consejero"
              value={period.counselor_2 ?? ""}
              onChange={(value) =>
  setCounselorPeriods((prev) =>
    prev.map((item) =>
      item.id === period.id
        ? { ...item, counselor_2: value }
        : item
    )
  )
}
            />
          </div>
        </div>
      ))}
    </div>
  )}
  <button
  type="button"
  onClick={() => {
    setCounselorPeriods((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${prev.length}`,
        bishop_id: bishop.id,
        start_date: "",
        end_date: "",
        counselor_1: "",
        counselor_2: "",
        order_index: prev.length + 1,
      },
    ]);
  }}
  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
>
  ＋ Añadir periodo de consejeros
</button>
</div>


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