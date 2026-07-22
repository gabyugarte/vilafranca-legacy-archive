CREATE TABLE public.branch_presidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  bio text,
  photo_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.branch_presidents TO anon;
GRANT SELECT ON public.branch_presidents TO authenticated;
GRANT ALL ON public.branch_presidents TO service_role;

ALTER TABLE public.branch_presidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to branch_presidents"
  ON public.branch_presidents
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_branch_presidents_updated_at
  BEFORE UPDATE ON public.branch_presidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.branch_presidents (name, start_date, end_date, bio, order_index)
VALUES (
  'Francisco Ibáñez',
  '1991-01-27',
  NULL,
  'Primer presidente de rama de Vilafranca. Bajo su liderazgo, la rama recibió oficialmente su organización el 27 de enero de 1991 y comenzaron los primeros llamamientos.',
  0
);