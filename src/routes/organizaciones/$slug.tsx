import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { HistoryGallery } from "@/components/history-gallery";
import {
  organizationGalleryQuery,
  organizationQuery,
} from "@/lib/queries.functions";

export const Route = createFileRoute("/organizaciones/$slug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      organizationQuery(params.slug),
    ),
  component: OrganizationPage,
});

function OrganizationPage() {
  const { slug } = Route.useParams();
const { data: organization } = useSuspenseQuery(
  organizationQuery(slug),
);

const { data: gallery } = useSuspenseQuery(
  organizationGalleryQuery(organization?.id ?? ""),
);
  

  if (!organization) {
    return (
      <>
        <PageHeader
          eyebrow="Organizaciones"
          title="Organización no encontrada"
          description="No hemos encontrado información para esta organización."
        />

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <Link
            to="/organizaciones"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Volver a organizaciones
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizaciones del barrio"
        title={organization.name}
        description={
          organization.short_description ??
          "Conoce la historia de esta organización del Barrio Vilafranca."
        }
      />

      <section className="mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6">
        {organization.photo_url && (
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src={organization.photo_url}
              alt={organization.name}
              className="h-auto max-h-[500px] w-full object-cover"
            />
          </div>
        )}

        {organization.history && (
          <article className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <h2 className="font-display text-3xl text-foreground">
              Su historia
            </h2>

            <p className="mt-4 leading-relaxed text-foreground/90">
              {organization.history}
            </p>
          </article>
        )}
        {gallery.length > 0 && (
  <article>
    <h2 className="font-display text-3xl text-foreground">
      Fotografías
    </h2>

<HistoryGallery
  images={gallery.map((photo) => ({
    image_url: photo.image_url,
    title: photo.title,
    caption: photo.caption,
  }))}
  title={organization.name}
/>
  </article>
)}

        <div>
          <Link
            to="/organizaciones"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Volver a organizaciones
          </Link>
        </div>
      </section>
    </>
  );
}