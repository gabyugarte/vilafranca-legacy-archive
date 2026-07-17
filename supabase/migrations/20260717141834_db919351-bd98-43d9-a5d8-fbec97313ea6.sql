
-- Categories enum for events
CREATE TYPE public.event_category AS ENUM (
  'hito', 'liderazgo', 'sociedad_socorro', 'primaria', 'hombres_jovenes',
  'mujeres_jovenes', 'escuela_dominical', 'elderes', 'servicio', 'actividad', 'general'
);

-- Events / timeline entries
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_date DATE NOT NULL,
  year INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category public.event_category NOT NULL DEFAULT 'general',
  cover_image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  testimony TEXT,
  is_new_chapter BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE INDEX events_year_idx ON public.events(year);
CREATE INDEX events_category_idx ON public.events(category);

-- Bishops leadership tree
CREATE TABLE public.bishops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  photo_url TEXT,
  bio TEXT,
  counselor_1 TEXT,
  counselor_2 TEXT,
  order_index INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.bishops TO anon, authenticated;
GRANT ALL ON public.bishops TO service_role;
ALTER TABLE public.bishops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bishops" ON public.bishops FOR SELECT USING (true);

-- Ward organizations
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT,
  history TEXT,
  photo_url TEXT,
  current_leader TEXT,
  order_index INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.organizations TO anon, authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read organizations" ON public.organizations FOR SELECT USING (true);

-- Pioneers tributes
CREATE TABLE public.pioneers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  years TEXT,
  photo_url TEXT,
  tribute TEXT,
  order_index INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.pioneers TO anon, authenticated;
GRANT ALL ON public.pioneers TO service_role;
ALTER TABLE public.pioneers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pioneers" ON public.pioneers FOR SELECT USING (true);

-- Faith stories
CREATE TABLE public.faith_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  photo_url TEXT,
  event_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faith_stories TO anon, authenticated;
GRANT ALL ON public.faith_stories TO service_role;
ALTER TABLE public.faith_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stories" ON public.faith_stories FOR SELECT USING (true);

-- Interviews / videos
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  person TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  summary TEXT,
  event_date DATE
);
GRANT SELECT ON public.interviews TO anon, authenticated;
GRANT ALL ON public.interviews TO service_role;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read interviews" ON public.interviews FOR SELECT USING (true);

-- Historical documents (scanned)
CREATE TABLE public.historical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  document_url TEXT,
  thumbnail_url TEXT,
  document_date DATE,
  year INT
);
GRANT SELECT ON public.historical_documents TO anon, authenticated;
GRANT ALL ON public.historical_documents TO service_role;
ALTER TABLE public.historical_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read documents" ON public.historical_documents FOR SELECT USING (true);

-- Gallery photos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  caption TEXT,
  image_url TEXT NOT NULL,
  photo_date DATE,
  year INT,
  category public.event_category
);
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_photos FOR SELECT USING (true);
