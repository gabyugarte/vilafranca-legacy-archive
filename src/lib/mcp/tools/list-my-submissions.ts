import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

export default defineTool({
  name: "list_my_submissions",
  title: "Ver mis aportaciones",
  description:
    "Devuelve las aportaciones (historias, eventos, fotos, documentos, entrevistas) enviadas por el usuario autenticado, con su estado de moderación.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "Debes iniciar sesión." }],
        isError: true,
      };
    }
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
    const uid = ctx.getUserId();
    const [stories, events, photos, docs, interviews] = await Promise.all([
      supabase.from("faith_stories").select("id,title,status,created_at").eq("submitted_by", uid),
      supabase.from("events").select("id,title,status,event_date").eq("submitted_by", uid),
      supabase.from("gallery_photos").select("id,title,status").eq("submitted_by", uid),
      supabase.from("historical_documents").select("id,title,status").eq("submitted_by", uid),
      supabase.from("interviews").select("id,title,status").eq("submitted_by", uid),
    ]);
    const payload = {
      faith_stories: stories.data ?? [],
      events: events.data ?? [],
      gallery_photos: photos.data ?? [],
      historical_documents: docs.data ?? [],
      interviews: interviews.data ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
