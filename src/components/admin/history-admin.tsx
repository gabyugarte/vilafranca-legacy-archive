import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function HistoryAdmin() {
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["admin", "history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", {
          ascending: true,
        });

      if (error) throw error;

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

return (
  <div className="space-y-6">

    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">
        Historia del Barrio
      </h1>

      <button
        className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
      >
        Nuevo capítulo
      </button>
    </div>

    <div className="overflow-hidden rounded-2xl border border-border bg-card">

      <table className="w-full text-sm">

        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Título</th>
            <th className="px-4 py-3 text-left">Categoría</th>
            <th className="px-4 py-3 text-center">Capítulo</th>
          </tr>
        </thead>

        <tbody>

          {chapters?.map((chapter) => (
            <tr
              key={chapter.id}
              className="border-t"
            >
              <td className="px-4 py-3">
                {chapter.event_date}
              </td>

              <td className="px-4 py-3 font-medium">
                {chapter.title}
              </td>

              <td className="px-4 py-3">
                {chapter.category}
              </td>

              <td className="px-4 py-3 text-center">
                {chapter.is_new_chapter ? "✅" : ""}
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </div>
);
}