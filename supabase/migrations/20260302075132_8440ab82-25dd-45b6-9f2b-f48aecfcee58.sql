
-- Create a public storage bucket for content images
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Allow anyone to view files in the bucket
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'content-images');

-- Allow authenticated developers/admins to upload files
CREATE POLICY "Developers can upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'content-images' AND
  (public.has_role(auth.uid(), 'developer') OR public.has_role(auth.uid(), 'admin'))
);

-- Allow authenticated developers/admins to delete files
CREATE POLICY "Developers can delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'content-images' AND
  (public.has_role(auth.uid(), 'developer') OR public.has_role(auth.uid(), 'admin'))
);
