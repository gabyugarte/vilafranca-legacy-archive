import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export default defineTool({
  name: "submit_faith_story",
  title: "Aportar una historia de fe",
  description:
    "Envía una nueva historia de fe al museo del Barrio Vilafranca. Queda en estado 'pendiente' hasta que un administrador la apruebe. Requiere sesión de usuario.",
  inputSchema: {
    title: z.string().trim().min(3).describe("Título de la historia."),
    author: z.string().trim().min(1).describe("Nombre de quien comparte la historia."),
    content: z.string().trim().min(20).describe("Texto completo de la historia."),
    year: z.number().int().optional().describe("Año aproximado del suceso, si se conoce."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "Debes iniciar sesión para aportar contenido." }],
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
    const { data, error } = await supabase
      .from("faith_stories")
      .insert({
        title: input.title,
        author: input.author,
        content: input.content,
        year: input.year ?? null,
        submitted_by: ctx.getUserId(),
      })
      .select("id,title,status")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [
        {
          type: "text",
          text: `Historia enviada correctamente. Estado: ${data.status}. Un administrador la revisará antes de publicarla.`,
        },
      ],
      structuredContent: { submission: data },
    };
  },
});
