import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function serverClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

export const fetchEvents = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchBishops = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("bishops")
    .select("*")
    .order("start_date", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchOrganizations = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchPioneers = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("pioneers")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchStories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("faith_stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchInterviews = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase.from("interviews").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchDocuments = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("historical_documents")
    .select("*")
    .order("document_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchGallery = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("status", "approved")
    .order("photo_date", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

// Query options
export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () => fetchEvents(),
});
export const bishopsQuery = queryOptions({
  queryKey: ["bishops"],
  queryFn: () => fetchBishops(),
});
export const organizationsQuery = queryOptions({
  queryKey: ["organizations"],
  queryFn: () => fetchOrganizations(),
});
export const pioneersQuery = queryOptions({
  queryKey: ["pioneers"],
  queryFn: () => fetchPioneers(),
});
export const storiesQuery = queryOptions({
  queryKey: ["stories"],
  queryFn: () => fetchStories(),
});
export const interviewsQuery = queryOptions({
  queryKey: ["interviews"],
  queryFn: () => fetchInterviews(),
});
export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: () => fetchDocuments(),
});
export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => fetchGallery(),
});

export const CATEGORY_LABELS: Record<string, string> = {
  hito: "Hito histórico",
  liderazgo: "Liderazgo",
  sociedad_socorro: "Sociedad de Socorro",
  primaria: "Primaria",
  hombres_jovenes: "Hombres Jóvenes",
  mujeres_jovenes: "Mujeres Jóvenes",
  escuela_dominical: "Escuela Dominical",
  elderes: "Cuórum de Élderes",
  servicio: "Servicio",
  actividad: "Actividad",
  general: "General",
};
