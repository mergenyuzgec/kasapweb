-- ============================================================
-- SİPARİŞ HATASI KESİN ÇÖZÜMÜ
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. Tablolarda eksik olma ihtimali olan kolonları ekliyoruz:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address JSONB;

-- 2. Supabase API (PostgREST) önbelleğini yeniliyoruz ki yeni eklenen
--    adres ve telefon kolonlarını hemen tanısın ve 406 hatası vermesin:
NOTIFY pgrst, 'reload schema';

-- 3. Kullanıcıların profil ekleyebilmesi için INSERT yetkisi
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Bildirimlerin ve siparişlerin KASAP PANELİNDE ANLIK GÖRÜNMESİ İÇİN
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;
END $$;
