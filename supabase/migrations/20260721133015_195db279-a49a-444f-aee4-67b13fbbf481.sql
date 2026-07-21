ALTER TABLE public.gallery_photos ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.historical_documents ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();