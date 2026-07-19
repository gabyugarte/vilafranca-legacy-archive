import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso · Barrio Vilafranca" },
      { name: "description", content: "Acceso al panel de administración del museo digital del Barrio Vilafranca." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/aportar" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/aportar" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/aportar" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/aportar" });
        else setMsg("Cuenta creada. Revisa tu correo para confirmar el acceso.");
      }
    } catch (e: any) {
      setErr(e.message ?? "Error de acceso");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Acceso"
        title="Panel de administración"
        description="Este espacio es para las personas encargadas de custodiar y ampliar el archivo del barrio."
      />
      <section className="mx-auto max-w-md px-4 pb-20 sm:px-6">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <div className="flex gap-2 rounded-full bg-muted p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full px-3 py-1.5 transition ${mode === "signin" ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"}`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-3 py-1.5 transition ${mode === "signup" ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"}`}
            >
              Crear cuenta
            </button>
          </div>

          <label className="block text-sm">
            <span className="text-muted-foreground">Correo electrónico</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Procesando…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="story-link">Volver al museo</Link>
          </p>
        </form>
      </section>
    </>
  );
}
