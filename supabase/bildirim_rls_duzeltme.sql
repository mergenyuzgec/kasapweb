-- ============================================================
-- BİLDİRİM (PUSH NOTIFICATION) RLS HATASI İÇİN KESİN ÇÖZÜM
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. kasap_devices tablosundaki RLS korumalarını ayarlıyoruz:
ALTER TABLE kasap_devices ENABLE ROW LEVEL SECURITY;

-- 2. Herkesin cihazını ekleyebilmesine (insert/upsert) izin veriyoruz.
DROP POLICY IF EXISTS "Public can insert devices" ON kasap_devices;
CREATE POLICY "Public can insert devices" ON kasap_devices 
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Kasapların (ve API'nin) cihazları okuyabilmesine izin veriyoruz.
DROP POLICY IF EXISTS "Public can view devices" ON kasap_devices;
CREATE POLICY "Public can view devices" ON kasap_devices 
  FOR SELECT USING (true);
