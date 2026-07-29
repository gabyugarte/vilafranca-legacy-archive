import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Gallery } from "@/components/gallery";
import { bishopsQuery } from "@/lib/queries.functions";
import { UserCircle2 } from "lucide-react";


export const Route = createFileRoute("/obispos")({
  loader: ({ context }) => context.queryClient.ensureQueryData(bishopsQuery),
  head: () => ({
    meta: [
      { title: "Obispos — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Árbol de liderazgo del Barrio Vilafranca con los obispos y su período de servicio.",
      },
      { property: "og:title", content: "Obispos — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Los obispos que han servido al Barrio Vilafranca.",
      },
    ],
  }),
  component: BishopsPage,
});

function fmt(date: string | null, fallback: string) {
  if (!date) return fallback;
  return new Date(date).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}
function bishopPhoto(name: string) {
  return `/images/bishops/${name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")}.jpg`;
}
function BishopsPage() {
  const { data: bishops } = useSuspenseQuery(bishopsQuery);
console.log(bishops);
  return (
    <>
      <PageHeader
        eyebrow="Liderazgo"
        title="Árbol de obispos"
        description="Cada obispo ha guiado al barrio en un tiempo concreto, con amor y dedicación. Aquí honramos su servicio."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="mx-auto space-y-16">
          {bishops.map((b) => (
<li key={b.id}>
  <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-xl">

    <div className="grid md:grid-cols-[280px_1fr]">

      {/* Fotografía */}
<div className="relative border border-primary/15 bg-primary/5 p-6">

{/* <img
  src={b.photo_url || "/images/bishops/default.jpg"}
  alt={b.name}
  className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl transition duration-500 hover:scale-[1.02] cursor-pointer"
/> */}
<img
  src={b.photo_url ?? ""}
  alt={b.name}
  onError={(e) => {
    console.log("ERROR CARGANDO:", b.photo_url);

    (e.currentTarget as HTMLImageElement).src =
      "/images/bishops/default.jpg";
  }}
  className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl transition duration-500 hover:scale-[1.02] cursor-pointer"
/>

</div>

      {/* Información */}
      <div className="p-8">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
           <h2 className="font-display text-4xl text-foreground">
              {b.name}
            </h2>

            <div className="mt-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {b.start_date || b.end_date
                ? `${fmt(b.start_date, "—")} — ${fmt(
                    b.end_date,
                    "Actualidad"
                  )}`
                : "Fechas por confirmar"}
            </div>
          </div>

          <UserCircle2 className="h-12 w-12 text-primary/40" />
        </div>

        {b.bio && (
          <p className="mt-8 text-lg leading-8 text-foreground/80">
            {b.bio}
          </p>
        )}

        {(b.counselor_1 || b.counselor_2) && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {b.counselor_1 && (
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Primer consejero
                </div>
                <div className="mt-1 font-medium">
                  {b.counselor_1}
                </div>
              </div>
            )}

            {b.counselor_2 && (
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Segundo consejero
                </div>
                <div className="mt-1 font-medium">
                  {b.counselor_2}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>

  </article>
</li>
          ))}
        </div>
      </section>
    </>
  );
}
