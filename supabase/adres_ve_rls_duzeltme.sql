-- ============================================================
-- SİPARİŞ VE PROFİL HATASI İÇİN DÜZELTME
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. Kullanıcıların profiles tablosuna kendi verilerini YAZABİLMESİ için INSERT policy ekleyelim.
-- (Kayıt olurken oluşan RLS hatasını ve siparişin bu sebeple patlamasını çözer)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Profillere adres kaydedilebilmesi için address JSONB alanı ekleyelim.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address JSONB;

-- 3. Bildirimlerin ve siparişlerin KASAP PANELİNDE ANLIK GÖRÜNMESİ İÇİN
-- publication hatasını yoksayıp çalışan alternatif yöntem:
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
