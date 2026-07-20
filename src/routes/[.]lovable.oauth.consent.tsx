import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

// Minimal typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthDetails = {
  client?: { name?: string; redirect_uris?: string[] } | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
  scope?: string | null;
};
type OAuthResult = { data: OAuthDetails | null; error: { message: string } | null };
const oauthApi = () =>
  (supabase.auth as unknown as {
    oauth: {
      getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
      approveAuthorization: (id: string) => Promise<OAuthResult>;
      denyAuthorization: (id: string) => Promise<OAuthResult>;
    };
  }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Falta authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) {
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="font-display text-2xl">No se pudo cargar la autorización</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {String((error as Error)?.message ?? error)}
      </p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthApi().approveAuthorization(authorization_id)
      : await oauthApi().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("El servidor de autorización no devolvió una URL de redirección.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "esta aplicación";

  return (
    <>
      <PageHeader
        eyebrow="Autorización"
        title={`Conectar ${clientName} al museo`}
        description="Esta aplicación podrá usar las herramientas del museo actuando en tu nombre, respetando tus permisos actuales."
      />
      <section className="mx-auto max-w-md px-4 pb-20 sm:px-6">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">{clientName}</strong> podrá:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Consultar el contenido público del museo (eventos, obispos, etc.).</li>
              <li>Enviar aportaciones (historias, fotos…) que quedarán pendientes de moderación.</li>
              <li>Ver el estado de tus propias aportaciones.</li>
            </ul>
            <p className="pt-2 text-xs">
              Esto no elude las políticas de acceso del museo: la aplicación solo verá y hará lo
              que tu cuenta ya puede.
            </p>
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              disabled={busy}
              onClick={() => decide(true)}
              className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Procesando…" : "Autorizar"}
            </button>
            <button
              disabled={busy}
              onClick={() => decide(false)}
              className="flex-1 rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
