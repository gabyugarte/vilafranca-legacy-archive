import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type DocumentUploaderProps = {
  bucket: string;
  value?: string | null;
  onChange: (url: string) => void;
};

export function DocumentUploader({
  bucket,
  value,
  onChange,
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);

    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";

    const filename = `${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    onChange(publicUrl);

    setUploading(false);
  }

  return (
    <div className="space-y-3">

      {value && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">
            📄 Documento seleccionado
          </p>

          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-primary underline"
          >
            Abrir documento
          </a>
        </div>
      )}

      <input
        type="file"
        accept="application/pdf,.pdf"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            upload(file);
          }
        }}
      />

      {uploading && (
        <p className="text-sm text-primary">
          Subiendo documento...
        </p>
      )}

    </div>
  );
}