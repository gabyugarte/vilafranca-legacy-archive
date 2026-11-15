
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImagePlus, Loader2 } from "lucide-react";

type ImageUploaderProps = {
  bucket: string;
  value?: string | null;
  onChange: (url: string) => void;
};

export function ImageUploader({
  bucket,
  value,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    
    console.log("DIAGNÓSTICO: ha comenzado la subida", file.name);
    setUploading(true);

    try {
      const extension = file.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, file, {
          upsert: true,
        });

      if (error) {
        alert(error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);

      onChange(publicUrl);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo subir la fotografía."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <img
          src={value}
          alt="Vista previa de la fotografía"
          className="h-48 w-40 rounded-xl border object-cover"
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
onChange={(e) => {
  const file = e.target.files?.[0];

  console.log("DIAGNÓSTICO: se ha seleccionado un archivo", file?.name);

  if (file) {
    void upload(file);
  }
}}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Subiendo fotografía...
          </>
        ) : (
          <>
            <ImagePlus className="h-5 w-5" />
            {value ? "Cambiar fotografía" : "Seleccionar fotografía"}
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground">
        Selecciona una imagen desde tu ordenador.
      </p>
    </div>
  );
}
