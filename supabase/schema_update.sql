-- ============================================================
-- KASAP PANELİ - SCHEMA GÜNCELLEMESİ
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştır
-- ============================================================

-- 1. profiles tablosuna username ekle
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- 2. products tablosuna stock_quantity ekle
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0;

-- 3. Kasap profil görüntüleme
-- NOT: "Public profiles are viewable by everyone" policy'si zaten var,
-- ek policy gerekmiyor. profiles tablosunda kendi kendini sorgulayan
-- policy infinite recursion hatası verir.

-- ============================================================
-- KASAP KULLANICI KAYDINI GÜNCELLE
-- Mevcut kasap hesabının e-posta adresini
-- Supabase Dashboard > Authentication > Users > Edit ile
-- "{kullanici_adi}@kasap.panel" formatına çevir.
-- Örneğin: kasap@kasap.panel
--
-- Ardından bu satırı düzenleyip çalıştır:
-- UPDATE profiles SET username = 'kasap' WHERE role = 'kasap';
-- ============================================================

-- ============================================================
-- SUPABASE STORAGE - product-images BUCKET
-- Dashboard > Storage > New Bucket oluştur:
--   Bucket adı : product-images
--   Public     : AÇIK (✅)
--
-- Ardından Storage > product-images > Policies altına ekle:
-- ============================================================
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Kasap can upload product images" ON storage.objects;
CREATE POLICY "Kasap can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Kasap can update product images" ON storage.objects;
CREATE POLICY "Kasap can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Kasap can delete product images" ON storage.objects;
CREATE POLICY "Kasap can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
