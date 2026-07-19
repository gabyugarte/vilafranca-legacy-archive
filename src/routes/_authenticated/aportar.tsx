import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import { CATEGORY_LABELS } from "@/lib/queries.functions";
import { Loader2, Upload, LogOut, CheckCircle2, Clock, XCircle, Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/aportar")({
  head: () => ({
    meta: [
      { title: "Aportar al archivo · Barrio Vilafranca" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContributePage,
});

type Kind = "evento" | "foto" | "historia" | "documento" | "entrevista";

const KINDS: { id: Kind; label: string }[] = [
  { id: "foto", label: "Fotografía" },
  { id: "historia", label: "Historia de fe" },
  { id: "documento", label: "Documento histórico" },
  { id: "entrevista", label: "Entrevista / Vídeo" },
  { id: "evento", label: "Evento / Actividad" },
];

function ContributePage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [kind, setKind] = useState<Kind>("foto");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (loading || !session) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Aportar al archivo"
        title="Comparte un capítulo"
        description="Tu aportación pasará a revisión antes de aparecer en el museo. Nada se publica automáticamente: un responsable del barrio la aprobará."
      />

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Sesión iniciada como <span className="text-foreground">{session.user.email}</span>
          </p>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-1 rounded-full bg-muted p-1 text-sm">
          {KINDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              className={`rounded-full px-4 py-1.5 transition ${
                kind === k.id
                  ? "bg-background shadow-soft text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {kind === "foto" && <PhotoForm userId={session.user.id} />}
          {kind === "historia" && <StoryForm userId={session.user.id} />}
          {kind === "documento" && <DocumentForm userId={session.user.id} />}
          {kind === "entrevista" && <InterviewForm userId={session.user.id} />}
          {kind === "evento" && <EventForm userId={session.user.id} />}
        </div>

        <MySubmissions userId={session.user.id} />
      </section>
    </>
  );
}

/* -------------------- Shared UI -------------------- */

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </label>
  );
}

function SuccessBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
      <Heart className="mt-0.5 h-5 w-5 text-primary" />
      <div>
        <p className="font-medium text-foreground">Gracias por tu aportación.</p>
        <p className="text-muted-foreground">
          La hemos guardado y aparecerá en el museo cuando un responsable la revise y apruebe.
        </p>
      </div>
    </div>
  );
}

function FileUploader({
  userId,
  accept,
  value,
  onChange,
  label = "Subir archivo",
}: {
  userId: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `submissions/${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data, error } = await supabase.storage
        .from("media")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (error) throw error;
      onChange(data.signedUrl);
    } catch (e: any) {
      setErr(e.message ?? "Error al subir");
    } finally {
      setBusy(false);
    }
  }

  const isImage = accept.includes("image");
  return (
    <div className="space-y-2">
      {value && isImage && (
        <img src={value} alt="" className="max-h-48 rounded-lg border border-border object-cover" />
      )}
      {value && !isImage && (
        <a href={value} target="_blank" rel="noreferrer" className="story-link text-sm">
          Ver archivo subido
        </a>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:bg-secondary">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Subiendo…" : value ? "Reemplazar archivo" : label}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            Quitar
          </button>
        )}
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
    </div>
  );
}

function SubmitButton({ busy, label = "Enviar aportación" }: { busy: boolean; label?: string }) {
  return (
    <button
      disabled={busy}
      className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90 disabled:opacity-60"
    >
      {busy ? "Enviando…" : label}
    </button>
  );
}

/* -------------------- Forms -------------------- */

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS);

function PhotoForm({ userId }: { userId: string }) {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [photoDate, setPhotoDate] = useState("");
  const [category, setCategory] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const qc = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    if (!imageUrl) return setErr("Sube una fotografía.");
    setBusy(true);
    const { error } = await supabase.from("gallery_photos").insert({
      image_url: imageUrl,
      title: title || null,
      caption: caption || null,
      photo_date: photoDate || null,
      year: photoDate ? Number(photoDate.slice(0, 4)) : null,
      category: (category || null) as never,
      status: "pending",
      submitted_by: userId,
    } as never);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setOk(true);
      setImageUrl("");
      setTitle("");
      setCaption("");
      setPhotoDate("");
      setCategory("");
      qc.invalidateQueries({ queryKey: ["my-submissions"] });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SuccessBanner show={ok} />
      <Field label="Fotografía">
        <FileUploader userId={userId} accept="image/*" value={imageUrl} onChange={setImageUrl} label="Subir fotografía" />
      </Field>
      <Field label="Título (opcional)">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Descripción (opcional)">
        <textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha (opcional)">
          <input type="date" value={photoDate} onChange={(e) => setPhotoDate(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Categoría (opcional)">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">—</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </Field>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex justify-end"><SubmitButton busy={busy} /></div>
    </form>
  );
}

function StoryForm({ userId }: { userId: string }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const qc = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOk(false); setBusy(true);
    const { error } = await supabase.from("faith_stories").insert({
      author, title, story,
      photo_url: photoUrl || null,
      event_date: date || null,
      status: "pending",
      submitted_by: userId,
    } as never);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setOk(true);
      setAuthor(""); setTitle(""); setStory(""); setPhotoUrl(""); setDate("");
      qc.invalidateQueries({ queryKey: ["my-submissions"] });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SuccessBanner show={ok} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Autor / Autora">
          <input required value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Fecha (opcional)">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Título">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Testimonio">
        <textarea required rows={8} value={story} onChange={(e) => setStory(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Fotografía (opcional)">
        <FileUploader userId={userId} accept="image/*" value={photoUrl} onChange={setPhotoUrl} />
      </Field>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex justify-end"><SubmitButton busy={busy} /></div>
    </form>
  );
}

function DocumentForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const qc = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOk(false);
    if (!documentUrl) return setErr("Sube el documento escaneado (PDF o imagen).");
    setBusy(true);
    const { error } = await supabase.from("historical_documents").insert({
      title, description: description || null,
      document_url: documentUrl,
      thumbnail_url: thumbnailUrl || null,
      document_date: date || null,
      year: date ? Number(date.slice(0, 4)) : null,
      status: "pending",
      submitted_by: userId,
    } as never);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setOk(true);
      setTitle(""); setDescription(""); setDocumentUrl(""); setThumbnailUrl(""); setDate("");
      qc.invalidateQueries({ queryKey: ["my-submissions"] });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SuccessBanner show={ok} />
      <Field label="Título del documento">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Descripción (opcional)">
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Documento escaneado" hint="PDF, JPG o PNG">
        <FileUploader userId={userId} accept="application/pdf,image/*" value={documentUrl} onChange={setDocumentUrl} label="Subir documento" />
      </Field>
      <Field label="Miniatura (opcional)">
        <FileUploader userId={userId} accept="image/*" value={thumbnailUrl} onChange={setThumbnailUrl} label="Subir miniatura" />
      </Field>
      <Field label="Fecha del documento (opcional)">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
      </Field>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex justify-end"><SubmitButton busy={busy} /></div>
    </form>
  );
}

function InterviewForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [person, setPerson] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const qc = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOk(false); setBusy(true);
    const { error } = await supabase.from("interviews").insert({
      title,
      person: person || null,
      video_url: videoUrl || null,
      thumbnail_url: thumbnailUrl || null,
      summary: summary || null,
      event_date: date || null,
      status: "pending",
      submitted_by: userId,
    } as never);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setOk(true);
      setTitle(""); setPerson(""); setVideoUrl(""); setThumbnailUrl(""); setSummary(""); setDate("");
      qc.invalidateQueries({ queryKey: ["my-submissions"] });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SuccessBanner show={ok} />
      <Field label="Título">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Persona entrevistada">
        <input value={person} onChange={(e) => setPerson(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Enlace al vídeo (YouTube, Vimeo, etc.)">
        <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inputCls} placeholder="https://…" />
      </Field>
      <Field label="Miniatura (opcional)">
        <FileUploader userId={userId} accept="image/*" value={thumbnailUrl} onChange={setThumbnailUrl} />
      </Field>
      <Field label="Resumen (opcional)">
        <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Fecha (opcional)">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
      </Field>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex justify-end"><SubmitButton busy={busy} /></div>
    </form>
  );
}

function EventForm({ userId }: { userId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [eventDate, setEventDate] = useState(today);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [coverUrl, setCoverUrl] = useState("");
  const [testimony, setTestimony] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const qc = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setOk(false); setBusy(true);
    const { error } = await supabase.from("events").insert({
      event_date: eventDate,
      year: Number(eventDate.slice(0, 4)),
      title,
      description: description || null,
      category: category as never,
      cover_image_url: coverUrl || null,
      testimony: testimony || null,
      is_new_chapter: true,
      status: "pending",
      submitted_by: userId,
    } as never);
    setBusy(false);
    if (error) setErr(error.message);
    else {
      setOk(true);
      setEventDate(today); setTitle(""); setDescription(""); setCategory("general");
      setCoverUrl(""); setTestimony("");
      qc.invalidateQueries({ queryKey: ["my-submissions"] });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <SuccessBanner show={ok} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha">
          <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Categoría">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Título">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Descripción">
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Testimonio (opcional)">
        <textarea rows={3} value={testimony} onChange={(e) => setTestimony(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Imagen destacada (opcional)">
        <FileUploader userId={userId} accept="image/*" value={coverUrl} onChange={setCoverUrl} />
      </Field>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex justify-end"><SubmitButton busy={busy} /></div>
    </form>
  );
}

/* -------------------- My submissions -------------------- */

function MySubmissions({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["my-submissions", userId],
    queryFn: async () => {
      const tables = [
        { key: "gallery_photos", label: "Fotografía", titleCol: "title", extraCol: "caption" },
        { key: "faith_stories", label: "Historia de fe", titleCol: "title", extraCol: "author" },
        { key: "historical_documents", label: "Documento", titleCol: "title", extraCol: "description" },
        { key: "interviews", label: "Entrevista", titleCol: "title", extraCol: "person" },
        { key: "events", label: "Evento", titleCol: "title", extraCol: "description" },
      ] as const;
      const results = await Promise.all(
        tables.map(async (t) => {
          const { data, error } = await supabase
            .from(t.key)
            .select("id, status, created_at, " + t.titleCol + ", " + t.extraCol)
            .eq("submitted_by", userId)
            .order("created_at", { ascending: false });
          if (error) return [];
          return (data ?? []).map((row: any) => ({
            id: row.id,
            kind: t.label,
            title: row[t.titleCol] ?? "(sin título)",
            extra: row[t.extraCol] ?? null,
            status: row.status as "pending" | "approved" | "rejected",
            created_at: row.created_at as string,
          }));
        }),
      );
      return results.flat().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    },
  });

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-foreground">Mis aportaciones</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Aquí puedes ver el estado de todo lo que has enviado. Solo un responsable puede editar o retirar aportaciones ya guardadas.
      </p>
      <div className="mt-4 space-y-2">
        {isLoading ? (
          <div className="grid place-items-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : !data?.length ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Todavía no has enviado ninguna aportación.
          </p>
        ) : (
          data.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.kind}</div>
                <div className="mt-0.5 truncate font-display text-lg text-foreground">{item.title}</div>
                {item.extra && <div className="truncate text-sm text-muted-foreground">{item.extra}</div>}
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved")
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
        <CheckCircle2 className="h-3.5 w-3.5" /> Publicado
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
        <XCircle className="h-3.5 w-3.5" /> No publicado
      </span>
    );
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
      <Clock className="h-3.5 w-3.5" /> En revisión
    </span>
  );
}
