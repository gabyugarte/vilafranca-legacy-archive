import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";


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

  async function upload(file: File) {
    setUploading(true);

    const extension = file.name.split(".").pop();

    const filename =
      `${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        upsert: true,
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
        <img
          src={value}
          alt=""
          className="h-48 w-40 rounded-xl object-cover border"
        />
      )}

      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) upload(file);
        }}
      />

      {uploading && (
        <p className="text-sm text-primary">
          Subiendo fotografía...
        </p>
      )}

    </div>
  );
}