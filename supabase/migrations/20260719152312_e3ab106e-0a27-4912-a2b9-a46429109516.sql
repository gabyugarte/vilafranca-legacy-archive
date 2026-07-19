
-- Enum for content status
DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add status + submitted_by to contributable tables
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.gallery_photos
  ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.faith_stories
  ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.historical_documents
  ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.interviews
  ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Replace public SELECT policies with approved-only
DROP POLICY IF EXISTS "Public read events" ON public.events;
CREATE POLICY "Public read approved events" ON public.events
  FOR SELECT TO public USING (status = 'approved');

DROP POLICY IF EXISTS "Public read gallery" ON public.gallery_photos;
CREATE POLICY "Public read approved gallery" ON public.gallery_photos
  FOR SELECT TO public USING (status = 'approved');

DROP POLICY IF EXISTS "Public read stories" ON public.faith_stories;
CREATE POLICY "Public read approved stories" ON public.faith_stories
  FOR SELECT TO public USING (status = 'approved');

DROP POLICY IF EXISTS "Public read documents" ON public.historical_documents;
CREATE POLICY "Public read approved documents" ON public.historical_documents
  FOR SELECT TO public USING (status = 'approved');

DROP POLICY IF EXISTS "Public read interviews" ON public.interviews;
CREATE POLICY "Public read approved interviews" ON public.interviews
  FOR SELECT TO public USING (status = 'approved');

-- Admins can read everything (including pending)
CREATE POLICY "Admins read all events" ON public.events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read all gallery" ON public.gallery_photos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read all stories" ON public.faith_stories
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read all documents" ON public.historical_documents
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read all interviews" ON public.interviews
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Contributors can view their own submissions (any status)
CREATE POLICY "Users read own events" ON public.events
  FOR SELECT TO authenticated USING (submitted_by = auth.uid());
CREATE POLICY "Users read own gallery" ON public.gallery_photos
  FOR SELECT TO authenticated USING (submitted_by = auth.uid());
CREATE POLICY "Users read own stories" ON public.faith_stories
  FOR SELECT TO authenticated USING (submitted_by = auth.uid());
CREATE POLICY "Users read own documents" ON public.historical_documents
  FOR SELECT TO authenticated USING (submitted_by = auth.uid());
CREATE POLICY "Users read own interviews" ON public.interviews
  FOR SELECT TO authenticated USING (submitted_by = auth.uid());

-- Authenticated contributors can INSERT but only as 'pending' tied to themselves
-- (Admin insert policies remain and allow any status.)
CREATE POLICY "Contributors submit events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');
CREATE POLICY "Contributors submit gallery" ON public.gallery_photos
  FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');

-- faith_stories/historical_documents/interviews had no insert/update/delete policies:
-- add admin-only management + contributor insert.
CREATE POLICY "Contributors submit stories" ON public.faith_stories
  FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');
CREATE POLICY "Admins update stories" ON public.faith_stories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete stories" ON public.faith_stories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert stories" ON public.faith_stories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Contributors submit documents" ON public.historical_documents
  FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');
CREATE POLICY "Admins update documents" ON public.historical_documents
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete documents" ON public.historical_documents
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert documents" ON public.historical_documents
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Contributors submit interviews" ON public.interviews
  FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');
CREATE POLICY "Admins update interviews" ON public.interviews
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete interviews" ON public.interviews
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert interviews" ON public.interviews
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
