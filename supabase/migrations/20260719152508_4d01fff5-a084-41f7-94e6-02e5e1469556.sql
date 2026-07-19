
CREATE POLICY "Users upload submissions media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'submissions'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Users read own submissions media"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'submissions'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Admins read media"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(),'admin'));
