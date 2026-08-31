import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/use-session";
import { CATEGORY_LABELS } from "@/lib/queries.functions";
import { Loader2, Pencil, Plus, Trash2, Upload, LogOut } from "lucide-react";
import { BishopsAdmin } from "@/components/bishops-admin";
import { HistoryAdmin } from "@/components/history-admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administración · Barrio Vilafranca" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab =
  | "moderacion"
  | "eventos"
  | "galeria"
  | "obispos"
  | "historia";function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, session, loading } = useIsAdmin();
  const [tab, setTab] = useState<Tab>("moderacion");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-foreground">Acceso restringido</h1>
        <p className="mt-3 text-muted-foreground">
          Tu cuenta ({session?.user.email}) no tiene permisos de administración.
          Solicita a un responsable del barrio que te asigne el rol.
        </p>
        <button
          onClick={signOut}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Panel del museo"
        description={`Sesión iniciada como ${session?.user.email}. Aquí puedes añadir y editar los eventos de la línea del tiempo y las fotografías de la galería.`}
      />

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex gap-1 rounded-full bg-muted p-1 text-sm">
            {(["moderacion", "eventos", "galeria", "obispos", "historia"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 transition ${tab === t ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"}`}
              >
                {t === "moderacion" ? "Moderación" : t === "eventos" ? "Eventos" : t === "galeria" ? "Galería" : t === "obispos" ? "Obispos" : "Historia"}
              </button>
            ))}
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>

{
  tab === "moderacion" ? (
    <ModerationPanel />
  ) : tab === "eventos" ? (
    <EventsAdmin />
  ) : tab === "galeria" ? (
    <GalleryAdmin />
  ) : tab === "obispos" ? (
    <BishopsAdmin />
  ) : (
    <HistoryAdmin />
  )
}      
      </section>
    </>
  );
}
/* -------------------- BISHOPS -------------------- */

type BishopRow = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  photo_url: string | null;
  bio: string | null;
  counselor_1: string | null;
  counselor_2: string | null;
  order_index: number;
};
/* -------------------- EVENTS -------------------- */

type EventRow = {
  id: string;
  event_date: string;
  year: number;
  title: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  testimony: string | null;
  is_new_chapter: boolean;
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS);

function emptyEvent(): Partial<EventRow> {
  const today = new Date().toISOString().slice(0, 10);
  return {
    event_date: today,
    year: new Date().getFullYear(),
    title: "",
    description: "",
    category: "general",
    cover_image_url: "",
    testimony: "",
    is_new_chapter: false,
  };
}

function EventsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<EventRow> | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data as EventRow[];
    },
  });

  async function remove(id: string) {
    if (!confirm("¿Eliminar este evento definitivamente?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) alert(error.message);
    else qc.invalidateQueries({ queryKey: ["admin", "events"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditing(emptyEvent())}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo evento
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {events?.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{e.event_date}</td>
                  <td className="px-4 py-3 text-foreground">{e.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{CATEGORY_LABELS[e.category] ?? e.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(e)} className="rounded-full p-2 hover:bg-secondary" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(e.id)} className="rounded-full p-2 text-destructive hover:bg-destructive/10" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!events?.length && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Aún no hay eventos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EventModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin", "events"] });
            qc.invalidateQueries({ queryKey: ["events"] });
          }}
        />
      )}
    </div>
  );
}

function EventModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Partial<EventRow>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<EventRow>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof EventRow>(k: K, v: EventRow[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    const payload = {
      event_date: form.event_date!,
      year: Number(form.year ?? new Date(form.event_date!).getFullYear()),
      title: form.title!,
      description: form.description || null,
      category: form.category || "general",
      cover_image_url: form.cover_image_url || null,
      testimony: form.testimony || null,
      is_new_chapter: !!form.is_new_chapter,
    };
    const q = form.id
      ? supabase.from("events").update(payload as never).eq("id", form.id)
      : supabase.from("events").insert(payload as never);
    const { error } = await q;
    setSaving(false);
    if (error) setErr(error.message);
    else onSaved();
  }

  return (
    <Modal onClose={onClose} title={form.id ? "Editar evento" : "Nuevo evento"}>
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha">
            <input
              type="date"
              required
              value={form.event_date ?? ""}
              onChange={(e) => {
                const d = e.target.value;
                update("event_date", d);
                if (d) update("year", Number(d.slice(0, 4)));
              }}
              className={inputCls}
            />
          </Field>
          <Field label="Categoría">
            <select
              value={form.category ?? "general"}
              onChange={(e) => update("category", e.target.value)}
              className={inputCls}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Título">
          <input required value={form.title ?? ""} onChange={(e) => update("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Descripción">
          <textarea rows={4} value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Testimonio (opcional)">
          <textarea rows={3} value={form.testimony ?? ""} onChange={(e) => update("testimony", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Imagen destacada">
          <ImageUploader
            value={form.cover_image_url ?? ""}
            onChange={(url) => update("cover_image_url", url)}
          />
        </Field>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={!!form.is_new_chapter}
            onChange={(e) => update("is_new_chapter", e.target.checked)}
          />
          Añadir también a "Seguimos escribiendo la historia"
        </label>

        {err && <p className="text-sm text-destructive">{err}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Cancelar</button>
          <button disabled={saving} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 disabled:opacity-60">
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------- GALLERY -------------------- */

type PhotoRow = {
  id: string;
  title: string | null;
  caption: string | null;
  image_url: string;
  photo_date: string | null;
  year: number | null;
  category: string | null;
};

function GalleryAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<PhotoRow> | null>(null);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("photo_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data as PhotoRow[];
    },
  });

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta fotografía?")) return;
    const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
    if (error) alert(error.message);
    else qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditing({ image_url: "", title: "", caption: "" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Subir fotografía
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos?.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              {p.image_url && (
                <img src={p.image_url} alt={p.title ?? ""} className="aspect-video w-full object-cover" loading="lazy" />
              )}
              <div className="p-4">
                <h3 className="font-display text-lg text-foreground">{p.title || "Sin título"}</h3>
                {p.caption && <p className="mt-1 text-sm text-muted-foreground">{p.caption}</p>}
                <div className="mt-2 text-xs text-muted-foreground">{p.photo_date ?? p.year ?? ""}</div>
                <div className="mt-3 flex justify-end gap-1">
                  <button onClick={() => setEditing(p)} className="rounded-full p-2 hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(p.id)} className="rounded-full p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
          {!photos?.length && (
            <p className="col-span-full py-10 text-center text-muted-foreground">Aún no hay fotografías.</p>
          )}
        </div>
      )}

      {editing && (
        <PhotoModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
            qc.invalidateQueries({ queryKey: ["gallery"] });
          }}
        />
      )}
    </div>
  );
}

function PhotoModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Partial<PhotoRow>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<PhotoRow>>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof PhotoRow>(k: K, v: PhotoRow[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url) {
      setErr("Sube una imagen antes de guardar.");
      return;
    }
    setSaving(true);
    setErr(null);
    const payload = {
      image_url: form.image_url,
      title: form.title || null,
      caption: form.caption || null,
      photo_date: form.photo_date || null,
      year: form.photo_date ? Number(form.photo_date.slice(0, 4)) : form.year ?? null,
      category: form.category || null,
    };
    const q = form.id
      ? supabase.from("gallery_photos").update(payload as never).eq("id", form.id)
      : supabase.from("gallery_photos").insert(payload as never);
    const { error } = await q;
    setSaving(false);
    if (error) setErr(error.message);
    else onSaved();
  }

  return (
    <Modal onClose={onClose} title={form.id ? "Editar fotografía" : "Nueva fotografía"}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Imagen">
          <ImageUploader value={form.image_url ?? ""} onChange={(url) => update("image_url", url)} />
        </Field>
        <Field label="Título">
          <input value={form.title ?? ""} onChange={(e) => update("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Descripción">
          <textarea rows={3} value={form.caption ?? ""} onChange={(e) => update("caption", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha (opcional)">
            <input type="date" value={form.photo_date ?? ""} onChange={(e) => update("photo_date", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Categoría (opcional)">
            <select
              value={form.category ?? ""}
              onChange={(e) => update("category", e.target.value || null)}
              className={inputCls}
            >
              <option value="">—</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </Field>
        </div>

        {err && <p className="text-sm text-destructive">{err}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Cancelar</button>
          <button disabled={saving} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 disabled:opacity-60">
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------- Shared UI -------------------- */

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="mt-8 w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-elegant">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-secondary">Cerrar</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      // Signed URL (10 years); bucket is private per workspace policy.
      const { data, error } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (error) throw error;
      onChange(data.signedUrl);
    } catch (e: any) {
      setErr(e.message ?? "Error al subir");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <img src={value} alt="" className="max-h-48 rounded-lg border border-border object-cover" />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-secondary">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Subiendo…" : value ? "Reemplazar imagen" : "Subir imagen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-sm text-muted-foreground hover:text-destructive">
            Quitar
          </button>
        )}
      </div>
      <input
        type="url"
        placeholder="…o pega una URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
      {err && <p className="text-sm text-destructive">{err}</p>}
    </div>
  );
}

/* -------------------- MODERATION -------------------- */

const MOD_TABLES = [
  { key: "gallery_photos", label: "Fotografía", titleCol: "title", extraCol: "caption", imgCol: "image_url" },
  { key: "faith_stories", label: "Historia de fe", titleCol: "title", extraCol: "story", imgCol: "photo_url" },
  { key: "historical_documents", label: "Documento", titleCol: "title", extraCol: "description", imgCol: "thumbnail_url" },
  { key: "interviews", label: "Entrevista", titleCol: "title", extraCol: "summary", imgCol: "thumbnail_url" },
  { key: "events", label: "Evento", titleCol: "title", extraCol: "description", imgCol: "cover_image_url" },
] as const;

type PendingItem = {
  table: (typeof MOD_TABLES)[number]["key"];
  kind: string;
  id: string;
  title: string;
  extra: string | null;
  image: string | null;
  submittedBy: string | null;
  createdAt: string;
};

function ModerationPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "moderation"],
    queryFn: async (): Promise<PendingItem[]> => {
      const rows = await Promise.all(
        MOD_TABLES.map(async (t) => {
          const { data, error } = await supabase
            .from(t.key)
            .select(`id, created_at, submitted_by, ${t.titleCol}, ${t.extraCol}, ${t.imgCol}`)
            .eq("status", "pending")
            .order("created_at", { ascending: false });
          if (error) return [] as PendingItem[];
          return (data ?? []).map((r: any) => ({
            table: t.key,
            kind: t.label,
            id: r.id,
            title: r[t.titleCol] ?? "(sin título)",
            extra: r[t.extraCol] ?? null,
            image: r[t.imgCol] ?? null,
            submittedBy: r.submitted_by ?? null,
            createdAt: r.created_at,
          }));
        }),
      );
      return rows.flat().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
  });

  async function decide(item: PendingItem, status: "approved" | "rejected") {
    const { error } = await supabase.from(item.table).update({ status } as never).eq("id", item.id);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "moderation"] });
    qc.invalidateQueries({ queryKey: [item.table === "gallery_photos" ? "gallery" : item.table === "faith_stories" ? "stories" : item.table === "historical_documents" ? "documents" : item.table === "interviews" ? "interviews" : "events"] });
  }

  async function remove(item: PendingItem) {
    if (!confirm("¿Eliminar definitivamente esta aportación?")) return;
    const { error } = await supabase.from(item.table).delete().eq("id", item.id);
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "moderation"] });
  }

  if (isLoading) {
    return <div className="grid place-items-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No hay aportaciones pendientes de revisión. ✨
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {data.length} aportación{data.length === 1 ? "" : "es"} en espera. Aprueba para publicar o rechaza para ocultar.
      </p>
      {data.map((item) => (
        <article key={`${item.table}-${item.id}`} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex flex-wrap gap-4">
            {item.image && (
              <img src={item.image} alt="" className="h-24 w-32 shrink-0 rounded-lg border border-border object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{item.kind}</span>
                <time className="text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("es-ES")}
                </time>
              </div>
              <h3 className="mt-1 font-display text-lg text-foreground">{item.title}</h3>
              {item.extra && (
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{item.extra}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                onClick={() => decide(item, "approved")}
                className="rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground shadow-soft hover:opacity-90"
              >
                Aprobar
              </button>
              <button
                onClick={() => decide(item, "rejected")}
                className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-secondary"
              >
                Rechazar
              </button>
              <button
                onClick={() => remove(item)}
                className="rounded-full px-4 py-1.5 text-xs text-destructive hover:bg-destructive/10"
              >
                Eliminar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// Silence unused import warning for useMemo (kept for future filters).
void useMemo;
