import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listEventsTool from "./tools/list-events";
import listBishopsTool from "./tools/list-bishops";
import submitFaithStoryTool from "./tools/submit-faith-story";
import listMySubmissionsTool from "./tools/list-my-submissions";

// The OAuth issuer must be the direct Supabase host (not the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "barrio-vilafranca-mcp",
  title: "Museo del Barrio Vilafranca",
  version: "0.1.0",
  instructions:
    "Herramientas para consultar la historia del Barrio Vilafranca (eventos, obispos) y aportar nuevo contenido (historias de fe) que queda pendiente de moderación.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listEventsTool, listBishopsTool, submitFaithStoryTool, listMySubmissionsTool],
});
