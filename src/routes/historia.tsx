import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Nuestra Historia — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Los orígenes, el crecimiento y el legado espiritual del Barrio Vilafranca de La Iglesia de Jesucristo de los Santos de los Últimos Días.",
      },
      { property: "og:title", content: "Nuestra Historia — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "El origen y el legado del Barrio Vilafranca.",
      },
    ],
  }),
  component: HistoriaPage,
});

function HistoriaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nuestra historia"
        title="Un barrio, muchas familias, una misma fe"
        description="Desde su creación, el Barrio Vilafranca ha sido un lugar de reunión, servicio y crecimiento espiritual. Esta es la memoria compartida de sus miembros."
      />

      <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-lg leading-relaxed text-foreground/90 sm:px-6">
        <p className="text-xl italic text-muted-foreground">
          «Cada barrio tiene una historia. La nuestra empezó con unas pocas
          familias, mucha fe y el deseo de construir Sion en Vilafranca».
        </p>

        <section>
          <h2 className="font-display text-3xl text-foreground">Los inicios</h2>
          <p className="mt-4 text-base">
            El Barrio Vilafranca fue organizado como una unidad de La Iglesia de
            Jesucristo de los Santos de los Últimos Días para reunir a los
            miembros que residían en la zona. En aquellos primeros años, las
            reuniones se celebraban con humildad y devoción, y la capilla se
            fue convirtiendo poco a poco en el corazón de la comunidad.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-foreground">Crecimiento y consolidación</h2>
          <p className="mt-4 text-base">
            Con el paso de los años, las auxiliares se organizaron y
            fortalecieron: la Sociedad de Socorro, la Primaria, las Mujeres
            Jóvenes, los Hombres Jóvenes, la Escuela Dominical y el Cuórum de
            Élderes. Cada una de ellas ha dejado huella en la vida de los
            miembros y en la historia del barrio.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-foreground">Un legado vivo</h2>
          <p className="mt-4 text-base">
            Hoy seguimos reuniéndonos, sirviendo y creciendo. Los rostros
            cambian, pero el testimonio de Jesucristo y la unión entre hermanos
            permanece. Esta web es nuestro intento de preservar y honrar todo lo
            recibido, y también un lugar para seguir escribiendo la historia que
            está por venir.
          </p>
        </section>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-xl text-foreground">
                Evolución del barrio
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                En futuras versiones incluiremos un mapa interactivo con la
                evolución geográfica del barrio y de sus límites a lo largo del
                tiempo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to="/linea-tiempo"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95"
          >
            Ver la línea del tiempo
          </Link>
          <Link
            to="/pioneros"
            className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Reconocimiento a los pioneros
          </Link>
        </div>
      </article>
    </>
  );
}
