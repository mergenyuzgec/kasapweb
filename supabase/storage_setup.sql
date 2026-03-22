-- ============================================================
-- SUPABASE STORAGE SETUP - PRODUCT IMAGES
-- ============================================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS Policies for the bucket

-- a. Allow public access to view images
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- b. Allow authenticated users (Kasap) to upload/update/delete
DROP POLICY IF EXISTS "Kasap can upload product images" ON storage.objects;
CREATE POLICY "Kasap can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Kasap can update product images" ON storage.objects;
CREATE POLICY "Kasap can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Kasap can delete product images" ON storage.objects;
CREATE POLICY "Kasap can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
