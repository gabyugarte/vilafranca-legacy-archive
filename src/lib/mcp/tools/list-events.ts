import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export default defineTool({
  name: "list_events",
  title: "Listar eventos aprobados",
  description:
    "Devuelve los eventos históricos publicados del Barrio Vilafranca ordenados por fecha, con filtro opcional por año o categoría.",
  inputSchema: {
    year: z.number().int().optional().describe("Filtrar por año exacto."),
    category: z
      .string()
      .optional()
      .describe("Filtrar por categoría (p. ej. hito, liderazgo, primaria)."),
    limit: z.number().int().min(1).max(100).optional().describe("Máximo 100, por defecto 50."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ year, category, limit }) => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("events")
      .select("id,title,description,event_date,year,category,testimony")
      .eq("status", "approved")
      .order("event_date", { ascending: true })
      .limit(limit ?? 50);
    if (year) q = q.eq("year", year);
    if (category) q = q.eq("category", category as Database["public"]["Enums"]["event_category"]);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { events: data ?? [] },
    };
  },
});
