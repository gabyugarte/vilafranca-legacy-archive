import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { galleryQuery } from "@/lib/queries.functions";
import { CATEGORY_LABELS } from "@/lib/queries.functions";

export const Route = createFileRoute("/galeria")({
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
  head: () => ({
    meta: [
      { title: "Galería Histórica — Barrio Vilafranca" },
      {
        name: "description",
        content:
          "Fotografías históricas del Barrio Vilafranca: actividades, retratos y momentos del barrio a lo largo de los años.",
      },
      { property: "og:title", content: "Galería Histórica — Barrio Vilafranca" },
      {
        property: "og:description",
        content: "Fotografías históricas del Barrio Vilafranca.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
 const { data: photos } = useSuspenseQuery(galleryQuery);

const [selectedCategory, setSelectedCategory] = useState<string>("all");
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

const categories = useMemo(() => {
  const availableCategories = new Set(
    photos
      .map((photo) => photo.category)
      .filter((category) => category !== null),
  );

  const hasYoungPhotos =
    availableCategories.has("hombres_jovenes") ||
    availableCategories.has("mujeres_jovenes");

  const allCategories = [
    { value: "hito" as const, label: CATEGORY_LABELS.hito },
    { value: "liderazgo" as const, label: CATEGORY_LABELS.liderazgo },
    {
      value: "sociedad_socorro" as const,
      label: CATEGORY_LABELS.sociedad_socorro,
    },
    { value: "primaria" as const, label: CATEGORY_LABELS.primaria },
    ...(hasYoungPhotos
      ? [{ value: "jovenes" as const, label: "Jóvenes" }]
      : []),
    {
      value: "escuela_dominical" as const,
      label: CATEGORY_LABELS.escuela_dominical,
    },
    { value: "elderes" as const, label: CATEGORY_LABELS.elderes },
    { value: "servicio" as const, label: CATEGORY_LABELS.servicio },
    { value: "actividad" as const, label: CATEGORY_LABELS.actividad },
    { value: "general" as const, label: CATEGORY_LABELS.general },
  ];

  return [
    { value: "all", label: `Todas (${photos.length})` },
    ...allCategories
      .filter((category) => {
        if (category.value === "jovenes") {
          return hasYoungPhotos;
        }

        return availableCategories.has(category.value);
      })
      .map((category) => ({
        ...category,
        label: `${category.label} (${
          category.value === "jovenes"
            ? photos.filter(
                (photo) =>
                  photo.category === "hombres_jovenes" ||
                  photo.category === "mujeres_jovenes",
              ).length
            : photos.filter(
                (photo) => photo.category === category.value,
              ).length
        })`,
      })),
  ];
}, [photos]);

const filteredPhotos = useMemo(() => {
  if (selectedCategory === "all") {
    return photos;
  }

  if (selectedCategory === "jovenes") {
    return photos.filter(
      (photo) =>
        photo.category === "hombres_jovenes" ||
        photo.category === "mujeres_jovenes",
    );
  }

  return photos.filter((photo) => photo.category === selectedCategory);
}, [photos, selectedCategory]);

const selectedPhoto =
  selectedIndex !== null ? filteredPhotos[selectedIndex] : null;


  const closeViewer = () => {
    setSelectedIndex(null);
  };

const showPrevious = () => {
  if (selectedIndex === null || filteredPhotos.length === 0) return;

  setSelectedIndex(
    selectedIndex === 0
      ? filteredPhotos.length - 1
      : selectedIndex - 1,
  );
};

const showNext = () => {
  if (selectedIndex === null || filteredPhotos.length === 0) return;

  setSelectedIndex(
    selectedIndex === filteredPhotos.length - 1
      ? 0
      : selectedIndex + 1,
  );
};

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <>
      <PageHeader
        eyebrow="Galería"
        title="Fotografías históricas"
        description="Un archivo visual del barrio: rostros, actividades y espacios que ya forman parte de nuestra memoria común."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10">
  <div className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
    Explorar por categoría
  </div>

  <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
    {categories.map((category) => (
      <button
        key={category.value}
        type="button"
        onClick={() => {
          setSelectedCategory(category.value);
          setSelectedIndex(null);
        }}
        className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
          selectedCategory === category.value
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
      >
        {category.label}
      </button>
    ))}
  </div>
</div>
{photos.length === 0 ? (
  <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border p-10 text-center">
    <Camera className="mx-auto h-8 w-8 text-muted-foreground" />

    <p className="mt-4 font-display text-xl text-foreground">
      La galería está esperando tus fotografías
    </p>

    <p className="mt-2 text-sm text-muted-foreground">
      Cuando se añadan fotografías al archivo del barrio, aparecerán
      aquí ordenadas por año y categoría.
    </p>
  </div>
) : filteredPhotos.length === 0 ? (
  <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border p-10 text-center">
    <Camera className="mx-auto h-8 w-8 text-muted-foreground" />

    <p className="mt-4 font-display text-xl text-foreground">
      Todavía no hay fotografías en esta categoría
    </p>

    <p className="mt-2 text-sm text-muted-foreground">
      Cuando se añadan fotografías, aparecerán aquí.
    </p>
  </div>
) : (
  <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
    {filteredPhotos.map((photo, index) => (
<figure
  key={photo.id}
  className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>        
<button
  type="button"
  onClick={() => setSelectedIndex(index)}
  className="block w-full cursor-pointer text-left"
          aria-label={`Ver fotografía ${
            photo.title ?? "histórica"
          }`}
        >
<div className="relative overflow-hidden">
  <img
    src={photo.image_url}
    alt={photo.title ?? "Foto histórica"}
    loading="lazy"
    className="w-full rounded-xl object-cover transition duration-500 group-hover:scale-[1.03]"
  />

  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
    <div className="rounded-full bg-white/90 p-3 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5 text-foreground"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    </div>
  </div>
{photo.year && (
  <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
    {photo.year}
  </div>
)}

</div>

{(photo.title || photo.caption || photo.year || photo.category) && (
  <figcaption className="px-4 py-4">
    {photo.category && (
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        {photo.category === "hombres_jovenes" ||
        photo.category === "mujeres_jovenes"
          ? "Jóvenes"
          : CATEGORY_LABELS[photo.category]}
      </div>
    )}

    {photo.title && (
      <div className="font-medium leading-snug text-foreground">
        {photo.title}
      </div>
    )}

    {photo.caption && (
      <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {photo.caption}
      </div>
    )}

    {photo.year && (
      <div className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-primary">
        {photo.year}
      </div>
    )}
  </figcaption>
)}
        </button>
      </figure>
    ))}
  </div>
)}
      </section>

      {selectedPhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotografías históricas"
        >
          <button
            type="button"
            onClick={closeViewer}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar visor"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-6 sm:p-3"
            aria-label="Fotografía anterior"
          >
            <ChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

          <div
            className="flex max-h-[92vh] max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title ?? "Foto histórica"}
              className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            <div className="mt-4 max-w-3xl text-center text-white">
              {selectedPhoto.title && (
                <h2 className="text-lg font-semibold sm:text-xl">
                  {selectedPhoto.title}
                </h2>
              )}

              {selectedPhoto.caption && (
                <p className="mt-1 text-sm text-white/75">
                  {selectedPhoto.caption}
                </p>
              )}

              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-white/60">
                {selectedPhoto.year && <span>{selectedPhoto.year}</span>}

                {selectedPhoto.year && <span>·</span>}

                <span>
                  {selectedIndex + 1} / {filteredPhotos.length}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-6 sm:p-3"
            aria-label="Fotografía siguiente"
          >
            <ChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        </div>
      )}
    </>
  );
}